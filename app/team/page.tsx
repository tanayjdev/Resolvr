"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Linkedin } from "lucide-react"
import Link from "next/link"
import PageTransition from "@/components/common/PageTransition"

const teamMembers = [
  {
    name: "Tanay Jain",
    role: "Backend Engineer & Infrastructure Lead",
    linkedin: "https://www.linkedin.com/in/tanay-jain-321617375",
    image: "/team/tanay.jpg",
  },
  {
    name: "Devang Bhawan",
    role: "Frontend Engineering Lead",
    linkedin: "https://www.linkedin.com/in/devang-bhawan-8248193a1",
    image: "/team/devang.jpg",
  },
  {
    name: "Chahak Agarwal",
    role: "Design & Product Lead",
    linkedin: "https://www.linkedin.com/in/chahak-agarwal-9a7ab8366",
    image: "/team/chahak.jpg",
  },
]

export default function TeamPage() {
  return (
    <PageTransition>
      <main className="relative min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="absolute inset-0 dot-pattern opacity-20" />
          
          {/* Glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-70" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] opacity-70" />

          <Container className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
              >
                <span className="text-sm font-semibold text-primary">TEAM AETHON</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1] font-bold font-[var(--font-syne)] mb-4 text-balance"
              >
                Meet the Team Behind{" "}
                <span className="text-gradient">RESOLVR</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto text-pretty mb-6"
              >
                The people responsible for engineering, design and product development of RESOLVR.
              </motion.p>

              {/* Team & Project Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Team:</span>
                  <span>Aethon</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Project:</span>
                  <span>RESOLVR</span>
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="relative py-12 md:py-16">
          <Container className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="glass-panel border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.02] hover:-translate-y-1 flex flex-col h-full">
                    {/* Profile Image */}
                    <div className="relative w-24 h-24 mx-auto mb-5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden border border-primary/30 group-hover:border-primary/50 transition-colors">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Fallback to initials if image not found
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<span class="text-3xl font-bold text-gradient">${member.name.split(' ').map(n => n[0]).join('')}</span>`
                            }
                          }}
                        />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold font-[var(--font-syne)] text-center mb-2">
                      {member.name}
                    </h3>

                    {/* Role */}
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {member.role}
                    </p>

                    {/* LinkedIn Button */}
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 group-hover:scale-[1.02] mt-auto"
                    >
                      <Linkedin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </PageTransition>
  )
}
