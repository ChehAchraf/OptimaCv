'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { frHeroContent } from '@/config/heroContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HiStar } from 'react-icons/hi2';
import { Badge } from './ui/badge';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  cta?: string;
}

const HeroSection = ({ title, subtitle, cta }: HeroSectionProps) => {
  const content = frHeroContent;

  return (
    <section className="bg-white dark:bg-gray-950 py-20 md:py-32">
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <motion.div
          className="flex flex-col space-y-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="text-sm font-medium text-blue-600 border-blue-200 bg-blue-50">
              {content.tryNowBadge}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white"
            variants={itemVariants}
          >
            {title || content.heading}
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground"
            variants={itemVariants}
          >
            {subtitle || content.subheading}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            variants={itemVariants}
          >
            <Button size="lg" asChild className="shadow-lg shadow-blue-500/20">
              <Link href="#demo">{cta || content.ctaPrimary}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#analyze">{content.ctaSecondary}</Link>
            </Button>
          </motion.div>

          <motion.div className="flex items-center space-x-4" variants={itemVariants}>
            <div className="flex -space-x-2 overflow-hidden">
              {content.socialProof.avatars.map((src, index) => (
                <Avatar key={index} className="h-10 w-10 border-2 border-white dark:border-gray-950">
                  <AvatarImage src={src} alt={`User ${index + 1}`} />
                  <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="h-5 w-5 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">{content.socialProof.stars}</span>
              </div>
              <span className="text-sm text-muted-foreground">{content.socialProof.reviews}</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative h-[400px] lg:h-[500px]">
          <motion.div
            className="absolute top-0 left-0 w-3/5 lg:w-1/2"
            initial={{ opacity: 0, x: -50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
          >
            <Card className="overflow-hidden shadow-xl">
              <Image
                src={content.visuals.image1_src}
                alt={content.visuals.image1_alt}
                width={400}
                height={300}
                className="object-cover"
                priority
              />
            </Card>
          </motion.div>

          <motion.div
            className="absolute top-20 right-0 w-2/5 lg:w-2/5"
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, type: 'spring' }}
          >
            <Card className="shadow-xl bg-gray-900 dark:bg-gray-800 text-white p-4">
              <div className="flex items-center space-x-3">
                <content.visuals.card1_icon className="h-8 w-8 text-green-400" />
                <div>
                  <p className="font-semibold">{content.visuals.card1_title}</p>
                  <p className="text-xs text-gray-400">{content.visuals.card1_date}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="absolute bottom-16 left-10 w-2/5 lg:w-2/5"
            initial={{ opacity: 0, x: -50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, type: 'spring' }}
          >
            <Card className="shadow-xl p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={content.visuals.card2_avatar} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold">{content.visuals.card2_score}</p>
                  <p className="text-xs text-muted-foreground">{content.visuals.card2_label}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="absolute bottom-0 right-5 w-3/5 lg:w-1/2"
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, type: 'spring' }}
          >
            <Card className="overflow-hidden shadow-xl">
              <Image
                src={content.visuals.image2_src}
                alt={content.visuals.image2_alt}
                width={400}
                height={300}
                className="object-cover"
                priority
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;