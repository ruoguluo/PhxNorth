import { Link } from 'react-router';
import { ArrowRight, Search, CheckCircle, Layers, Target, Brain, Award, TrendingUp, Users, MessageSquare, RefreshCw } from 'lucide-react';
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(stageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="PhxNorth" className="h-8" />
            <span className="text-xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/individuals" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Individuals
            </Link>
            <Link to="/mentors" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Mentors
            </Link>
            <Link to="/enterprises" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              For Enterprises
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-[#0A2463] transition-colors">
              How It Works
            </Link>
            <Link to="/why-phxnorth" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Why PhxNorth
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-[#0A2463] transition-colors">
              Log In
            </Link>
            <Link to="/account-type-selection" className="bg-[#0A2463] text-white px-6 py-2.5 rounded-lg hover:bg-[#0A2463]/90 transition-all text-sm font-semibold shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            How PhxNorth Works
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            From vague questions to structured growth — powered by continuous 5D identity intelligence.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/account-type-selection"
              className="inline-flex items-center gap-2 bg-white text-[#0A2463] px-10 py-4 rounded-lg hover:bg-gray-100 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-blue-100">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-semibold underline hover:text-blue-50">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-24">
            {/* Step 1 - Identify Core Career Direction */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-blue-600 font-bold mb-2">STEP 1</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Identify the Core Career Direction
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  The system interprets the user's initial question using the existing 5D profile and guided prompts to identify the likely direction of the decision.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Decision type identification:</strong> promotion, transition, or strategic initiative</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Context extraction:</strong> responsibilities, constraints, and current environment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Output:</strong> confirmed career objective and primary decision direction</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">User Question</div>
                      <p className="text-gray-900 font-medium text-sm leading-relaxed">
                        "I am not sure what my next career step should be."
                      </p>
                    </div>
                    
                    <div className="border-t pt-4 mb-4">
                      <div className="text-xs text-gray-500 mb-3">System Identification</div>
                      
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1.5">Goal Type</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">Career Promotion</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">Job Change</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1.5">Context Tags</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">Team Management</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">Business Growth</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">Strategy / Leadership</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1.5">Constraint Signals</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Family responsibility</span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Limited travel flexibility</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Outcome of Step 1</div>
                        <div className="text-sm text-blue-800">
                          Career objective confirmed: seeking promotion or strategic role change with limited travel constraints.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Decompose into Structured Pathway */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Layers className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-emerald-600 font-bold mb-2">STEP 2</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Decompose the Question into a Structured Pathway
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Once the high-level objective is identified, the system breaks the large question into smaller, structured sub-questions. This gradually transforms the vague career concern into a clear decision pathway.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Progressive clarification:</strong> situation → bottlenecks → real challenge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Problem synthesis:</strong> system-generated insight from user inputs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Output:</strong> structured mentorship blueprint with clear stages</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm text-gray-500 mb-4">Progressive Decomposition</div>
                    
                    <div className="space-y-6">
                      {/* Stage 1 - Situation Snapshot */}
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: activeStage >= 0 ? 1 : 0.4 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                            activeStage >= 0 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            1
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold mb-2 text-sm transition-colors ${
                              activeStage >= 0 ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              Situation Snapshot
                            </div>
                            <AnimatePresence>
                              {activeStage >= 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4 }}
                                  className="space-y-1.5 overflow-hidden"
                                >
                                  <div className="text-xs text-gray-600">Understanding current role and environment</div>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Considering promotion</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Team management</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Business growth focus</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {activeStage >= 0 && (
                          <div className={`ml-4 h-6 w-0.5 transition-colors ${
                            activeStage > 0 ? 'bg-emerald-600' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </motion.div>

                      {/* Stage 2 - Identify Bottlenecks */}
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: activeStage >= 1 ? 1 : 0.4 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                            activeStage >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            2
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold mb-2 text-sm transition-colors ${
                              activeStage >= 1 ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              Identify Bottlenecks
                            </div>
                            <AnimatePresence>
                              {activeStage >= 1 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4 }}
                                  className="space-y-1.5 overflow-hidden"
                                >
                                  <div className="text-xs text-gray-600">Revealing real obstacles</div>
                                  <div className="space-y-1 mt-2">
                                    <div className="flex items-start gap-2 text-xs text-gray-700">
                                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                                      <span>Low visibility within organization</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-gray-700">
                                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                                      <span>Lack of ownership of major projects</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {activeStage >= 1 && (
                          <div className={`ml-4 h-6 w-0.5 transition-colors ${
                            activeStage > 1 ? 'bg-emerald-600' : 'bg-gray-200'
                          }`}></div>
                        )}
                      </motion.div>

                      {/* Stage 3 - Clarify Real Challenge */}
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: activeStage >= 2 ? 1 : 0.4 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                            activeStage >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            3
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold mb-2 text-sm transition-colors ${
                              activeStage >= 2 ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              Clarify the Real Challenge
                            </div>
                            <AnimatePresence>
                              {activeStage >= 2 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 leading-relaxed">
                                    "The key challenge is not simply finding a new role, but increasing leadership visibility and ownership of high-impact projects to support promotion."
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-xs font-semibold text-gray-700 mb-1.5">Mentorship Blueprint:</div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-gray-700">1. Define viable career direction</div>
                                      <div className="text-xs text-gray-700">2. Build strategic project ownership</div>
                                      <div className="text-xs text-gray-700">3. Position for promotion or targeted opportunities</div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Match Mentor and Manage Process */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-purple-600 font-bold mb-2">STEP 3</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Match the Right Mentor and Manage the Mentorship Process
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Based on the structured problem and the user's 5D profile, the platform identifies mentors whose experience, decision style, and behavioral patterns align with the user's needs.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>5D precision matching:</strong> experience, cognitive fit, and behavioral alignment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Pre-aligned engagement:</strong> both sides understand the structured question and agenda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Adaptive matching:</strong> system recommends new mentors if fit isn't optimal for a sub-problem</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm text-gray-500 mb-6">Mentorship Management</div>
                    
                    <div className="space-y-4">
                      {/* Matched Mentor */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                            LK
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">Lisa Kim</div>
                            <div className="text-xs text-gray-600">VP Strategic Initiatives, Fortune 500</div>
                            <div className="flex gap-1.5 mt-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">5D Match: 94%</span>
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Available</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 bg-white/70 p-2 rounded">
                          <strong>Pre-aligned on:</strong> Career positioning strategy, promotion path definition
                        </div>
                      </div>

                      {/* Progress Tracking */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-3">Session Progress</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-700">Stage 1: Career Direction</span>
                            <span className="text-emerald-700 font-semibold">✓ Complete</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-700">Stage 2: Project Ownership</span>
                            <span className="text-blue-700 font-semibold">● In Progress</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Stage 3: Positioning</span>
                            <span className="text-gray-400">Upcoming</span>
                          </div>
                        </div>
                      </div>

                      {/* Adaptive Matching */}
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-xs font-semibold text-amber-900 mb-1">Adaptive Matching</div>
                        <div className="text-xs text-amber-800">
                          If effectiveness drops, the system can recommend a better-aligned mentor for the next stage based on your evolving 5D profile.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 - 5D Profile Evolution */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="md:w-1/2">
                <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <RefreshCw className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-indigo-600 font-bold mb-2">CONTINUOUS EVOLUTION</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The 5D Identity Profile Continuously Evolves
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Every interaction—questions, decisions, mentorship discussions, and outcomes—enriches your 5D identity profile. This continuously improving model powers precision matching, talent mobility, and enterprise advisory opportunities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Continuous learning:</strong> decision patterns, communication preferences, risk calibration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Powers three ecosystems:</strong> mentorship matching, talent mobility, and advisory projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Output:</strong> better outcomes with every interaction, unlocking new opportunities</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-sm text-gray-500 mb-6">5D Identity Dimensions</div>
                    
                    <div className="space-y-4">
                      {[
                        { icon: Target, title: "Hard Skills", desc: "Technical expertise, domain knowledge, certifications", color: "blue" },
                        { icon: Users, title: "Soft Skills", desc: "Communication, leadership, collaboration patterns", color: "emerald" },
                        { icon: Brain, title: "Decision Logic", desc: "Problem-solving approach, cognitive style, frameworks used", color: "purple" },
                        { icon: TrendingUp, title: "Risk Calibration", desc: "Risk tolerance, decision speed, ambiguity comfort", color: "amber" },
                        { icon: Award, title: "Network Capital", desc: "Industry connections, institutional affiliations, endorsements", color: "pink" }
                      ].map((dimension, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.4 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            dimension.color === 'blue' ? 'bg-blue-100' :
                            dimension.color === 'emerald' ? 'bg-emerald-100' :
                            dimension.color === 'purple' ? 'bg-purple-100' :
                            dimension.color === 'amber' ? 'bg-amber-100' :
                            'bg-pink-100'
                          }`}>
                            <dimension.icon className={`w-5 h-5 ${
                              dimension.color === 'blue' ? 'text-blue-600' :
                              dimension.color === 'emerald' ? 'text-emerald-600' :
                              dimension.color === 'purple' ? 'text-purple-600' :
                              dimension.color === 'amber' ? 'text-amber-600' :
                              'text-pink-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1 text-sm">{dimension.title}</div>
                            <div className="text-xs text-gray-600">{dimension.desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="text-xs font-semibold text-indigo-900 mb-2">Powered By Your 5D Profile</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          <span className="text-xs text-indigo-800">Precision mentorship matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          <span className="text-xs text-indigo-800">Global talent mobility opportunities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                          <span className="text-xs text-indigo-800">Enterprise advisory & consulting</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Transform vague questions into structured growth systems
          </p>
          <Link
            to="/account-type-selection"
            className="inline-flex items-center gap-2 bg-[#0A2463] text-white px-10 py-4 rounded-lg hover:bg-[#0A2463]/90 transition-all text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}