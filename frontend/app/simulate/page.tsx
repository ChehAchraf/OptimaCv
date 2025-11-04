'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Report = {
  scores: { content: number; structure: number; clarity: number; confidence: number; stress: number; body_language: number; overall: number };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};

export default function SimulatePage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [report, setReport] = useState<Report | null>(null);
  const [running, setRunning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const recRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const lastResultAtRef = useRef<number>(0);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    try { speechSynthesis.cancel(); } catch {}
    speechSynthesis.speak(u);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9,opus' });
    mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      // optional upload:
      // if (sessionId) { const fd = new FormData(); fd.append('file', blob, 'interview.webm');
      // await fetch(`http://localhost:8000/api/v1/interview/session/${sessionId}/media`, { method: 'POST', body: fd }); }
    };
    mr.start(1000);
    recorderRef.current = mr;
  };

  const stopRecording = () => { try { recorderRef.current?.stop(); } catch {} };

  const startASR = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(() => {
        // If no new results for 1500ms, consider the answer done -> ask next question
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({ type: 'control', action: 'next' }));
        }
      }, 1500);
    };

    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const text = res[0].transcript.trim();
        if (text) {
          lastResultAtRef.current = Date.now();
          if (res.isFinal) {
            if (wsRef.current) wsRef.current.send(JSON.stringify({ type: 'transcript', text, timestamp_ms: Date.now() }));
            resetSilenceTimer();
          }
        }
      }
    };
    rec.onend = () => {
      // auto-restart for robustness while running
      if (running) startASR();
    };
    rec.start();
    recRef.current = rec;
  };

  const stopASR = () => { try { recRef.current?.stop(); } catch {} };

  const connectWS = (id: string) => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/interview/session/${id}/ws`);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'question') {
        setCurrentQuestion(msg.text);
        speak(msg.text);
      }
      if (msg.type === 'info' && msg.text === 'done') {
        finish(); // auto-finish when server says done (after 3 questions)
      }
    };
    wsRef.current = ws;
  };

  const startAll = async () => {
    if (!cvFile || !jd || running) return;
    setRunning(true);
    // 1) Create session
    const fd = new FormData();
    fd.append('cv_pdf', cvFile);
    fd.append('job_description', jd);
    const r = await fetch('http://localhost:8000/api/v1/interview/session/create', { method: 'POST', body: fd });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      setRunning(false);
      throw new Error(err.detail || 'Failed to create session');
    }
    const data = await r.json();
    setSessionId(data.session_id);

    // 2) Camera+Mic, 3) WS, 4) ASR, 5) Recording
    await startCamera();
    connectWS(data.session_id);
    startASR();
    startRecording();
  };

  const finish = async () => {
    setRunning(false);
    if (silenceTimerRef.current) { window.clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    try { wsRef.current?.send(JSON.stringify({ type: 'control', action: 'finish' })); } catch {}
    try { wsRef.current?.close(); } catch {}
    wsRef.current = null;

    stopASR();
    stopRecording();
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }

    if (!sessionId) return;
    const r = await fetch(`http://localhost:8000/api/v1/interview/session/${sessionId}/finalize`, { method: 'POST' });
    const data = await r.json();
    setReport(data);
  };

  useEffect(() => {
    return () => {
      try { wsRef.current?.close(); } catch {}
      stopASR();
      stopRecording();
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      if (silenceTimerRef.current) { window.clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    };
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Interview Simulation (HR, 3 questions)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!sessionId && !running && !report && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload CV (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea rows={8} value={jd} onChange={(e) => setJd(e.target.value)} />
              </div>
              <Button onClick={startAll} disabled={!cvFile || !jd}>Start</Button>
            </div>
          )}

          {(sessionId || running) && !report && (
            <div className="space-y-4">
              <video ref={videoRef} className="w-full max-h-80 rounded bg-black" muted playsInline />
              <div className="p-4 rounded border">
                <div className="font-semibold mb-2">Current Question</div>
                <div>{currentQuestion || 'Waiting for the interviewer...'}</div>
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              <div className="text-lg font-semibold">Overall: {report.scores.overall}/10</div>
              <div className="grid grid-cols-2 gap-2">
                <div>Content: {report.scores.content}/10</div>
                <div>Structure: {report.scores.structure}/10</div>
                <div>Clarity: {report.scores.clarity}/10</div>
                <div>Confidence: {report.scores.confidence}/10</div>
                <div>Stress: {report.scores.stress}/10</div>
                <div>Body language: {report.scores.body_language}/10</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold">Summary</div>
                <div className="text-sm">{report.summary}</div>
              </div>
              <div>
                <div className="font-semibold">Strengths</div>
                <ul className="list-disc list-inside">{report.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold">Weaknesses</div>
                <ul className="list-disc list-inside">{report.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold">Recommendations</div>
                <ul className="list-disc list-inside">{report.recommendations.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}