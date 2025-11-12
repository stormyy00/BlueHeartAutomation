import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is this platform built for?",
    answer:
      "It's designed for nonprofits and community-driven organizations to automate newsletters, social media content, and donor outreach — without technical barriers or hidden costs.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes! We believe impact tools should be accessible. The platform's core automation and AI tools are completely free for verified nonprofits.",
  },
  {
    question: "Can multiple team members collaborate?",
    answer:
      "Absolutely. Invite teammates, assign roles, and collaborate on campaigns in real time with shared workspaces and version history.",
  },
  {
    question: "How does AI improve my marketing throughput?",
    answer:
      "Our AI engine learns from your campaigns to suggest optimized subject lines, social captions, and posting schedules — helping your outreach scale effortlessly.",
  },
  {
    question: "What about data security?",
    answer:
      "We use end-to-end encryption and GDPR-compliant storage. Your organization's data is never used for third-party training or marketing purposes.",
  },
];

const FAQSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#edf6f9]/50 via-white to-[#83c5be]/10">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C6D96]/10 text-[#1C6D96] font-medium text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQs
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1C6D96]">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#1C6D96] to-[#83c5be] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-lg text-[#7e8287] max-w-2xl">
            Everything you need to know about how our platform helps you scale
            your mission — faster, smarter, and with impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-white/60 rounded-2xl shadow-lg border border-[#83c5be]/30 text-left"
        >
          <Accordion type="single" collapsible className=" ">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`${i}`}
                className="px-6 no-underline"
              >
                <AccordionTrigger className="no-underline text-lg font-semibold py-5 text-[#1C6D96] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#7e8287] pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
