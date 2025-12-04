'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';

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
const MapPin = dynamic(() => import('lucide-react').then(mod => mod.MapPin), { ssr: false });
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

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            // Reset status after 5 seconds
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        {t('title')}
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Description */}
                <div className="text-center mb-12">
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <Suspense fallback={<CardLoader />}>
                            <Card className="shadow-xl border-none bg-white">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{t('form.name')}</CardTitle>
                                    <CardDescription>{t('description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Name Field */}
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                    {t('form.name')}
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder={t('form.namePlaceholder')}
                                                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>

                                            {/* Email Field */}
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    {t('form.email')}
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder={t('form.emailPlaceholder')}
                                                    className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                        </div>

                                        {/* Subject Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                                                {t('form.subject')}
                                            </Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder={t('form.subjectPlaceholder')}
                                                className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        {/* Message Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                                {t('form.message')}
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder={t('form.messagePlaceholder')}
                                                rows={6}
                                                className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full md:w-auto px-8 py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        {t('form.submitting')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        {t('form.submit')}
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {/* Success/Error Messages */}
                                        {submitStatus === 'success' && (
                                            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 animate-in fade-in slide-in-from-top-2">
                                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                                <p>{t('successMessage')}</p>
                                            </div>
                                        )}

                                        {submitStatus === 'error' && (
                                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 animate-in fade-in slide-in-from-top-2">
                                                <span className="text-xl flex-shrink-0">⚠️</span>
                                                <p>{t('errorMessage')}</p>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </Suspense>
                    </div>

                    {/* Contact Information - Takes 1 column */}
                    <div className="space-y-6">
                        <Suspense fallback={<CardLoader />}>
                            {/* Email Card */}
                            <ContactInfoCard
                                icon={<Mail className="w-6 h-6" />}
                                title={t('info.email.title')}
                                value={t('info.email.value')}
                                bgColor="bg-blue-50"
                                iconColor="text-blue-600"
                            />

                            {/* Phone Card */}
                            <ContactInfoCard
                                icon={<Phone className="w-6 h-6" />}
                                title={t('info.phone.title')}
                                value={t('info.phone.value')}
                                bgColor="bg-green-50"
                                iconColor="text-green-600"
                            />

                            {/* Address Card */}
                            <ContactInfoCard
                                icon={<MapPin className="w-6 h-6" />}
                                title={t('info.address.title')}
                                value={t('info.address.value')}
                                bgColor="bg-purple-50"
                                iconColor="text-purple-600"
                            />

                            {/* Business Hours Card */}
                            <ContactInfoCard
                                icon={<Clock className="w-6 h-6" />}
                                title={t('info.hours.title')}
                                value={t('info.hours.value')}
                                bgColor="bg-orange-50"
                                iconColor="text-orange-600"
                            />

                            {/* Social Media Card */}
                            <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-none bg-white">
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{t('info.social.title')}</h3>
                                            <p className="text-sm text-gray-600">{t('info.social.description')}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <SocialButton
                                                icon={<Instagram className="w-5 h-5" />}
                                                href="https://instagram.com"
                                                color="text-pink-600 bg-pink-50 hover:bg-pink-100"
                                            />
                                            <SocialButton
                                                icon={<Linkedin className="w-5 h-5" />}
                                                href="https://linkedin.com"
                                                color="text-blue-700 bg-blue-50 hover:bg-blue-100"
                                            />
                                            <SocialButton
                                                icon={<Facebook className="w-5 h-5" />}
                                                href="https://facebook.com"
                                                color="text-blue-600 bg-blue-50 hover:bg-blue-100"
                                            />
                                            <SocialButton
                                                icon={<Twitter className="w-5 h-5" />}
                                                href="https://twitter.com"
                                                color="text-sky-500 bg-sky-50 hover:bg-sky-100"
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
        <Card className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-none bg-white">
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className={`p-3 ${bgColor} ${iconColor} rounded-xl flex-shrink-0`}>
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-600 break-words">{value}</p>
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
