// Step 1 - home.tsx file is created

import React from "react";
import type { Route } from "../../+types/root";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  CheckCircle2,
  Clock,
  Users,
  Zap,
  BarChart3,
  Shield,
  Rocket,
  Star,
  ArrowRight,
  ListChecks,
  Target,
  TrendingUp,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskMaster - Modern Project Management Made Simple" },
    {
      name: "description",
      content:
        "Streamline your workflow with TaskMaster. Collaborate with your team, track progress, and achieve your goals faster.",
    },
  ];
}

const Homepage = () => {
  const features = [
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Task Management",
      description:
        "Create, assign, and track tasks with ease. Stay organized and never miss a deadline.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly. Share workspaces, assign tasks, and communicate in real-time.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Visualize your progress with intuitive charts and dashboards. Make data-driven decisions.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description:
        "Built for speed. Experience blazing-fast performance with our optimized platform.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Privacy is our priority.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Oriented",
      description:
        "Set clear goals and milestones. Track your progress and celebrate achievements.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Tasks Completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-primary/5 dark:from-primary/10 dark:via-background dark:to-primary/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TaskMaster</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link to="/sign-in">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <Rocket className="w-3 h-3 mr-1" />
            New: AI-powered task suggestions now available
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Project Management
            <span className="block text-primary mt-2">Made Simple</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your workflow, collaborate with your team, and achieve
            your goals faster with TaskMaster. The modern task manager built for
            high-performing teams.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg h-12 px-8"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to
              <span className="block text-primary">stay productive</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you and your team work smarter,
              not harder.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-linear-to-br from-primary/80 to-primary/70 border-0">
            <CardContent className="py-12 px-8 text-center space-y-6 text-primary-foreground">
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium">
                "TaskMaster has transformed how our team collaborates. We're now
                30% more productive and hit our deadlines consistently."
              </blockquote>
              <div className="space-y-1">
                <div className="font-semibold">D Jan</div>
                <div className="text-primary-foreground/80">
                  Project Manager at TechCorp
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to boost your
              <span className="block text-primary">productivity?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of teams already using TaskMaster to achieve their
              goals. Start your free trial today.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg h-12 px-8"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="outline" className="text-lg h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">TaskMaster</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 TaskMaster. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
