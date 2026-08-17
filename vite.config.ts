import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function mayaApiPlugin(): Plugin {
  return {
    name: 'maya-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/maya', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const userPrompt = data.prompt || '';
            const userContext = data.context || {};
            const language = data.language || 'bn';

            const apiKey = process.env.GEMINI_API_KEY;

            if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
              try {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({
                  apiKey,
                  httpOptions: {
                    headers: { 'User-Agent': 'aistudio-build' },
                  },
                });

                const systemInstruction = `You are MAYA, the official intelligent AI assistant for TaskBD — Bangladesh's premier microtask, freelance, and service marketplace.
Your goal is to assist users (and admins) with friendly, helpful, accurate guidance in ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Platform Knowledge:
- Platform: TaskBD (Bangladesh Microtask, Service Marketplace & Escrow Platform)
- Currency: BDT (৳ Taka)
- Account verification fee: ৳15 (via bKash, Nagad, Rocket)
- Publishing Activation fee: ৳50
- Escrow system: 100% secured payments for jobs & services. 24-hour auto-release protection after order delivery.
- Deposit / Withdrawal methods: bKash, Nagad, Rocket. Minimum deposit ৳50, minimum withdrawal ৳100.
- User status: ${JSON.stringify(userContext)}
Answer concisely, with warmth, clarity, and formatting with bullet points. Always speak in ${language === 'bn' ? 'natural, polite Bengali (বাংলা)' : 'clear English'}.`;

                const response = await ai.models.generateContent({
                  model: 'gemini-3.7-flash',
                  contents: userPrompt,
                  config: {
                    systemInstruction,
                  },
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply: response.text || 'মায়া আপনার সেবায় প্রস্তুত!' }));
                return;
              } catch (genAiErr) {
                console.error('Gemini API error, falling back:', genAiErr);
              }
            }

            // Fallback intelligent responses if API key is not configured
            let fallbackReply = '';
            const q = userPrompt.toLowerCase();

            if (q.includes('deposit') || q.includes('টাকা জমা') || q.includes('ডিপোজিট')) {
              fallbackReply = language === 'bn' 
                ? '💸 ডিপোজিট করার জন্য: \n1. "Wallet" বা "Deposit" মেন্যুতে যান।\n2. bKash, Nagad অথবা Rocket নির্বাচন করুন।\n3. নির্ধারিত নম্বরে ক্যাশ-ইন / সেন্ড মানি করুন।\n4. Transaction ID (TrxID) দিয়ে রিকোয়েস্ট সাবমিট করুন। অ্যাডমিন ৫-১৫ মিনিটে অ্যাপ্রুভ করবেন।'
                : '💸 To deposit:\n1. Go to Wallet > Deposit.\n2. Choose bKash, Nagad, or Rocket.\n3. Send money to the provided number.\n4. Submit with your Transaction ID. Approval takes 5-15 mins.';
            } else if (q.includes('withdraw') || q.includes('টাকা তোলা') || q.includes('উইথড্র')) {
              fallbackReply = language === 'bn'
                ? '🏧 টাকা উত্তোলনের নিয়ম:\n1. Wallet > Withdraw-এ যান।\n2. আপনার কাঙ্ক্ষিত অ্যামাউন্ট ও পেমেন্ট নম্বর দিন।\n3. প্ল্যাটফর্ম ফি বাদ দিয়ে আপনার অ্যাকাউন্টে টাকা পৌঁছে যাবে।'
                : '🏧 To withdraw:\n1. Go to Wallet > Withdraw.\n2. Enter amount and payment account.\n3. Funds will be sent after swift admin verification.';
            } else if (q.includes('verify') || q.includes('ভেরিফাই') || q.includes('ভেরিফিকেশন')) {
              fallbackReply = language === 'bn'
                ? '🛡️ অ্যাকাউন্ট ভেরিফিকেশন:\nভেরিফিকেশন ফি মাত্র ৳১৫। ভেরিফিকেশন পেজে গিয়ে bKash/Nagad/Rocket দিয়ে পেমেন্ট করে TrxID সাবমিট করুন। ভেরিফাইড হলে আপনার অ্যাকাউন্টে ব্লু টিক ও সব ফিচার আনলক হবে।'
                : '🛡️ Account Verification:\nVerification fee is ৳15. Submit payment details on the Verification page to unlock all marketplace features and a verified badge.';
            } else if (q.includes('workspace') || q.includes('service') || q.includes('সার্ভিস') || q.includes('জব') || q.includes('job')) {
              fallbackReply = language === 'bn'
                ? '💼 মাই ওয়ার্কস্পেস:\nওয়ার্কস্পেস থেকে আপনি সার্ভিস ও জব পাবলিশ করতে পারবেন, রিসিভড অর্ডার ম্যানেজ করতে পারবেন এবং আয় দেখতে পারবেন। পাবলিশিং একটিভেশন ফি মাত্র ৳৫০।'
                : '💼 My Workspace:\nManage your services, post microtasks/jobs, handle buyer orders, and view escrow earnings in real-time.';
            } else if (q.includes('escrow') || q.includes('এসক্রো') || q.includes('নিরাপত্তা')) {
              fallbackReply = language === 'bn'
                ? '🔒 TaskBD এসক্রো সুরক্ষা:\nঅর্ডার করার সময় বায়ারের পেমেন্ট এসক্রোতে সুরক্ষিত থাকে। সেলার কাজ ডেলিভারি দিলে বায়ারের রিভিউয়ের জন্য ২৪ ঘণ্টা সময় থাকে। বায়ার সন্তুষ্ট হয়ে অ্যাপ্রুভ করলেই সেলারের ওয়ালেটে টাকা চলে যায়।'
                : '🔒 TaskBD Escrow Protection:\nFunds are secured in escrow during order fulfillment. A 24-hour auto-release safeguard ensures fair payouts for completed work.';
            } else {
              fallbackReply = language === 'bn'
                ? `নমস্কার / আসসালামু আলাইকুম! আমি **মায়া**, TaskBD-এর এআই অ্যাসিস্ট্যান্ট।\n\nআমি আপনাকে যেভাবে সাহায্য করতে পারি:\n• 💳 ডিপোজিট ও উইথড্রয়াল প্রক্রিয়া\n• 🛡️ অ্যাকাউন্ট ও পাবলিশিং ভেরিফিকেশন\n• 💼 জব পোস্ট ও সার্ভিস অর্ডার\n• 🔒 এসক্রো পেমেন্ট ও ইনভয়েস\n\nআপনার কী প্রয়োজন নিচে জানান!`
                : `Hello! I am **Maya**, the official AI Assistant for TaskBD.\n\nI can help you with:\n• 💳 Wallet Deposits & Withdrawals\n• 🛡️ Account & Publishing Verification\n• 💼 Job Postings & Service Orders\n• 🔒 Escrow & Invoices\n\nHow may I assist you today?`;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply: fallbackReply }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mayaApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
