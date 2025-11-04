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
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [report, setReport] = useState<Report | null>(null);
  const [listening, setListening] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const recRef = useRef<any>(null);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  const startRecognition = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          const text = res[0].transcript.trim();
          if (wsRef.current) {
            wsRef.current.send(JSON.stringify({ type: 'transcript', text, timestamp_ms: Date.now() }));
          }
        }
      }
    };
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const stopRecognition = () => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  };

  const createSession = async () => {
    if (!cvFile || !jd) return;
    const fd = new FormData();
    fd.append('cv_pdf', cvFile);
    fd.append('job_description', jd);
    const r = await fetch('http://localhost:8000/api/v1/interview/session/create', { method: 'POST', body: fd });
    const data = await r.json();
    setSessionId(data.session_id);
    setQuestions(data.initial_questions || []);
    setCurrentQuestion((data.initial_questions && data.initial_questions[0]) || '');
  };

  const connectWS = () => {
    if (!sessionId) return;
    const ws = new WebSocket(`ws://localhost:8000/api/v1/interview/session/${sessionId}/ws`);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'question') {
        setCurrentQuestion(msg.text);
        speak(msg.text);
      }
    };
    ws.onopen = () => {
      // Send initial metrics snapshot (optional)
      ws.send(JSON.stringify({ type: 'metrics', payload: { wpm: 0 } }));
    };
    wsRef.current = ws;
  };

  const finish = async () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'control', action: 'finish' }));
      wsRef.current.close();
    }
    stopRecognition();
    if (!sessionId) return;
    const r = await fetch(`http://localhost:8000/api/v1/interview/session/${sessionId}/finalize`, { method: 'POST' });
    const data = await r.json();
    setReport(data);
  };

  useEffect(() => {
    return () => {
      try { wsRef.current?.close(); } catch {}
      stopRecognition();
    };
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Interview Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!sessionId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload CV (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea rows={8} value={jd} onChange={(e) => setJd(e.target.value)} />
              </div>
              <Button onClick={createSession} disabled={!cvFile || !jd}>Create Session</Button>
            </div>
          )}

          {sessionId && !report && (
            <div className="space-y-4">
              <div className="p-4 rounded border">
                <div className="font-semibold mb-2">Current Question</div>
                <div>{currentQuestion || 'Waiting for the interviewer...'}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={connectWS} disabled={!!wsRef.current}>Connect</Button>
                {!listening ? (
                  <Button variant="outline" onClick={startRecognition}>Start Answering</Button>
                ) : (
                  <Button variant="outline" onClick={stopRecognition}>Pause</Button>
                )}
                <Button variant="destructive" onClick={finish}>Finish & Get Report</Button>
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