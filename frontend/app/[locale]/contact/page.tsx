'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';
import ContactSupportForm from '@/components/contact/ContactSupportForm';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card), {
    loading: () => <CardLoader />,
});
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription));
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Input = dynamic(() => import('@/components/ui/input').then(mod => mod.Input));
const Textarea = dynamic(() => import('@/components/ui/textarea').then(mod => mod.Textarea));
const Label = dynamic(() => import('@/components/ui/label').then(mod => mod.Label));

const Mail = dynamic(() => import('lucide-react').then(mod => mod.Mail), { ssr: false });
const Phone = dynamic(() => import('lucide-react').then(mod => mod.Phone), { ssr: false });
const Clock = dynamic(() => import('lucide-react').then(mod => mod.Clock), { ssr: false });
const Send = dynamic(() => import('lucide-react').then(mod => mod.Send), { ssr: false });
const CheckCircle2 = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle2), { ssr: false });
const Instagram = dynamic(() => import('lucide-react').then(mod => mod.Instagram), { ssr: false });
const Linkedin = dynamic(() => import('lucide-react').then(mod => mod.Linkedin), { ssr: false });
const Facebook = dynamic(() => import('lucide-react').then(mod => mod.Facebook), { ssr: false });
const Twitter = dynamic(() => import('lucide-react').then(mod => mod.Twitter), { ssr: false });

export default function ContactPage() {
    const t = useTranslations('ContactPage');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        {t('title')}
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Suspense fallback={<CardLoader />}>
                            <Suspense fallback={<CardLoader />}>
                                <ContactSupportForm />
                            </Suspense>
                        </Suspense>
                    </div>

                    <div className="space-y-6">
                        <Suspense fallback={<CardLoader />}>
                            <ContactInfoCard
                                icon={<Mail className="w-6 h-6" />}
                                title={t('info.email.title')}
                                value={t('info.email.value')}
                                bgColor="bg-blue-50 dark:bg-blue-900/20"
                                iconColor="text-blue-600 dark:text-blue-400"
                            />

                            <ContactInfoCard
                                icon={<Phone className="w-6 h-6" />}
                                title={t('info.phone.title')}
                                value={t('info.phone.value')}
                                bgColor="bg-green-50 dark:bg-green-900/20"
                                iconColor="text-green-600 dark:text-green-400"
                            />

                            <ContactInfoCard
                                icon={<Clock className="w-6 h-6" />}
                                title={t('info.hours.title')}
                                value={t('info.hours.value')}
                                bgColor="bg-orange-50 dark:bg-orange-900/20"
                                iconColor="text-orange-600 dark:text-orange-400"
                            />

                            <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-none bg-white dark:bg-gray-900">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t('info.social.title')}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('info.social.description')}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <SocialButton
                                                icon={<Instagram className="w-5 h-5" />}
                                                href="https://instagram.com"
                                                color="text-pink-600 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 dark:text-pink-400"
                                            />
                                            <SocialButton
                                                icon={<Linkedin className="w-5 h-5" />}
                                                href="https://linkedin.com"
                                                color="text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
                                            />
                                            <SocialButton
                                                icon={<Facebook className="w-5 h-5" />}
                                                href="https://facebook.com"
                                                color="text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
                                            />
                                            <SocialButton
                                                icon={<Twitter className="w-5 h-5" />}
                                                href="https://twitter.com"
                                                color="text-sky-500 bg-sky-50 hover:bg-sky-100 dark:bg-sky-900/20 dark:hover:bg-sky-900/30 dark:text-sky-400"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Contact Info Card Component
function ContactInfoCard({
    icon,
    title,
    value,
    bgColor,
    iconColor
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    bgColor: string;
    iconColor: string;
}) {
    return (
        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-none bg-white dark:bg-gray-900">
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 ${bgColor} ${iconColor} rounded-xl flex-shrink-0`}>
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Social Button Component
function SocialButton({
    icon,
    href,
    color
}: {
    icon: React.ReactNode;
    href: string;
    color: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${color}`}
        >
            {icon}
        </a>
    );
}
