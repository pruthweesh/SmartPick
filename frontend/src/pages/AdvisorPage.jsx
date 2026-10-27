/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Info,
  Check,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useApp } from '../context/AppContext.jsx';

export const AdvisorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Recommendation State
  const [sessionId, setSessionId] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [nearMatches, setNearMatches] = useState([]);
  const [conflictExplanation, setConflictExplanation] = useState(null);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [totalEligible, setTotalEligible] = useState(0);
  const [isEditingConstraints, setIsEditingConstraints] = useState(false);
  const [advisorError, setAdvisorError] = useState(null);

  const loadingSteps = [
    'Parsing budget ceiling and must-have hardware parameters...',
    'Applying strict hard filters (budget, verified ANC, battery threshold)...',
    'Cross-referencing official BIS & lab test specification sheets...',
    'Executing deterministic 6-factor ranking formula...',
    'Synthesizing transparent acoustic fit rationale and compromises...'
  ];

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQueryInput(q);
      executeRecommendation(q);
    }
  }, [searchParams]);

  const executeRecommendation = async (userQuery, customReq) => {
    setLoading(true);
    setLoadingStep(0);
    setAdvisorError(null);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const payload = customReq
        ? { requirements: customReq }
        : { query: userQuery };

      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        if (res.status === 502 || res.status === 503 || res.status === 504) {
          setAdvisorError({
            type: 'ai-failure',
            message: 'AI Advisor Reasoning Service Timed Out',
            details: 'The synthesis reasoning service took longer than expected to process the acoustic requirements. The deterministic specification engine is still functioning.'
          });
        } else {
          setAdvisorError({
            type: 'server-error',
            message: 'Advisor Recommendation Service Unavailable',
            details: `HTTP ${res.status}: SmartPick recommendation backend could not finish processing your query.`
          });
        }
        return;
      }

      const data = await res.json();
      setSessionId(data.session_id);
      setRequirements(data.extracted_requirements);
      setClarifyingQuestions((data.clarifying_questions || []).slice(0, 3));
      setRecommendations(data.recommendations || []);
      setNearMatches(data.near_matches || []);
      setConflictExplanation(data.conflict_explanation);
      setAiExplanation(data.ai_explanation);
      setTotalEligible(data.total_eligible || 0);
      setSelectedAnswers({});
    } catch (err) {
      clearInterval(stepInterval);
      setAdvisorError({
        type: 'server-error',
        message: 'Network Connection Interrupted',
        details: 'Failed to communicate with the recommendation engine. Please verify your connection and retry.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) {
      showToast('Please describe what you are looking for.');
      return;
    }
    executeRecommendation(queryInput.trim());
  };

  const handleClarifySubmit = async () => {
    if (Object.keys(selectedAnswers).length === 0) {
      showToast('Please select at least one option to refine your matches.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/recommendations/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_requirements: requirements,
          answers: selectedAnswers
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRequirements(data.updated_requirements);
        setClarifyingQuestions([]);
        setRecommendations(data.recommendations || []);
        setNearMatches(data.near_matches || []);
        setConflictExplanation(data.conflict_explanation);
        setAiExplanation(data.ai_explanation);
        setTotalEligible(data.total_eligible || 0);
        showToast('Advisor updated with your refined criteria!');
      }
    } catch {
      showToast('Error applying clarification.');
    } finally {
      setLoading(false);
    }
  };

  const handleConstraintUpdate = (updated) => {
    const merged = { ...requirements, ...updated };
    setRequirements(merged);
    executeRecommendation('', merged);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Intro */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10.5px] font-mono uppercase tracking-wider mb-2 border border-black/[0.06] dark:border-white/[0.06]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Category Requirement Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Find your exact tech match.
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
          Describe your budget and everyday performance needs. Our engine maps your criteria across smartphones, laptops, audio, smartwatches, and lifestyle tech, applies hard filters, and presents <strong>3–5 vetted recommendations</strong> with transparent compromises.
        </p>
      </div>

      {/* Step 1: Natural Language Intake Module */}
      <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-[11px] font-mono uppercase tracking-[0.18em] font-semibold text-neutral-500">
            Natural Language Requirement Intake
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="e.g. I need a lightweight laptop under ₹1,20,000 with a stunning OLED screen and all-day battery for coding and Figma..."
              className="w-full p-4 rounded-2xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50/70 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Scenarios:</span>
              {[
                'Flagship phone for camera under ₹75,000',
                'MacBook or OLED laptop for coding under ₹1,20,000',
                'Top ANC headphones under ₹35,000 for travel',
                'Reliable laptop under ₹45,000 for students',
                'Earbuds under ₹2,500 for gym & daily calls'
              ].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setQueryInput(chip);
                    executeRecommendation(chip);
                  }}
                  className="px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide transition flex items-center justify-center gap-2 shadow-xs shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Evaluating Requirements...' : 'Analyze & Curate'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State with Animated Stepper */}
      {loading && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-8 border border-black/[0.08] dark:border-white/[0.08] text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white animate-spin mx-auto" />
          <h3 className="font-bold text-neutral-900 dark:text-white text-base">
            Evaluating 41 Audited Products Across 6 Categories Against Your Criteria
          </h3>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {loadingSteps[loadingStep]}
          </p>
          <div className="w-full max-w-sm mx-auto bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 dark:bg-white h-full transition-all duration-300"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 2: Interactive Clarifying Questions (Maximum 3 Questions) */}
      {!loading && clarifyingQuestions.length > 0 && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.18em] text-neutral-500 mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Refinement Parameters (Max 3 Questions)</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Narrow down the recommendation pool
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 self-start sm:self-auto">
              {clarifyingQuestions.length} Questions Identified
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {clarifyingQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-neutral-50 dark:bg-neutral-850 p-5 rounded-2xl border border-black/[0.05] dark:border-white/[0.05] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Question {idx + 1} of {clarifyingQuestions.length} · {q.dimension ? q.dimension.replace('_', ' ') : 'Requirement'}
                  </span>
                  {selectedAnswers[q.id] && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold font-mono">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                  {q.question}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = selectedAnswers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer border flex items-center gap-2 ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 shadow-2xs'
                            : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-neutral-750'
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-500 font-mono">
              Answer any question to refine the ranking formula.
            </span>
            <button
              onClick={handleClarifySubmit}
              className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>Apply Refinements</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Criteria & Hard Filter Status */}
      {!loading && requirements && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 border border-black/[0.08] dark:border-white/[0.08] shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-neutral-500 font-semibold">
                  Acoustic Constraints Active
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                  Deterministic Filters
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-black/[0.06] dark:border-white/[0.06] font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                  Ceiling: ₹{requirements.budget_max?.toLocaleString('en-IN') || 5000}
                </span>

                {requirements.intended_use?.map((u) => (
                  <span
                    key={u}
                    className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-black/[0.06] dark:border-white/[0.06] font-medium text-neutral-700 dark:text-neutral-300 capitalize"
                  >
                    Focus: {u}
                  </span>
                ))}

                {requirements.must_have_features?.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-black/[0.06] dark:border-white/[0.06] font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    ✓ {f.toUpperCase()}
                  </span>
                ))}

                <span className="text-neutral-400 text-xs pl-1 font-mono">
                  ({Math.max(0, 41 - totalEligible)} models eliminated by constraints)
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingConstraints(!isEditingConstraints)}
              className="px-4 py-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-semibold text-xs flex items-center gap-1.5 self-start md:self-auto shrink-0 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEditingConstraints ? 'Close Filter Editor' : 'Adjust Filters'}</span>
            </button>
          </div>

          {/* Interactive Filter Adjuster */}
          {isEditingConstraints && (
            <div className="pt-4 mt-2 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs animate-in fade-in duration-150">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Budget Ceiling: ₹{requirements.budget_max?.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min={1000}
                  max={150000}
                  step={2500}
                  value={requirements.budget_max || 150000}
                  onChange={e => handleConstraintUpdate({ budget_max: Number(e.target.value) })}
                  className="w-full accent-neutral-900 dark:accent-white"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Priority Focus
                </label>
                <select
                  value={requirements.usage_priority || 'value'}
                  onChange={e => handleConstraintUpdate({ usage_priority: e.target.value })}
                  className="w-full p-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="value">Best Overall Value</option>
                  <option value="performance">Heavy Multitasking & Speed</option>
                  <option value="camera">Flagship Photography & 4K Video</option>
                  <option value="display">OLED / High-Res Screen Quality</option>
                  <option value="battery">All-Day Marathon Battery Life</option>
                  <option value="sound">Acoustic Clarity & ANC</option>
                  <option value="durability">Rugged & Weather Protection</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Hardware Feature Requirement
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current = requirements.must_have_features || [];
                    const next = current.includes('anc')
                      ? current.filter((x) => x !== 'anc')
                      : [...current, 'anc'];
                    handleConstraintUpdate({ must_have_features: next });
                  }}
                  className={`w-full py-2 px-3 rounded-xl border font-semibold ${
                    requirements.must_have_features?.includes('anc')
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08]'
                  }`}
                >
                  {requirements.must_have_features?.includes('anc') ? '✓ Mandatory Hardware ANC' : 'Optional Hardware ANC'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advisor Error State */}
      {!loading && advisorError && (
        <EmptyState
          type={advisorError.type}
          title={advisorError.message}
          description={advisorError.details}
          details="SmartPick runs dual layers: an AI reasoning layer and a deterministic lab specifications layer. If the AI service is experiencing high traffic, you can retry or consult our catalog with manual filters."
          actionText="Retry AI Advisor"
          onAction={() => executeRecommendation(queryInput, requirements)}
          secondaryActionText="Browse All Tested Products"
          secondaryActionHref="/products"
        />
      )}

      {/* AI Advisor Synthesis Narrative */}
      {!loading && !advisorError && aiExplanation && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">Advisor Verdict & Synthesis</h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {aiExplanation}
          </p>
        </div>
      )}

      {/* Conflict / Constraint Explanation */}
      {!loading && !advisorError && conflictExplanation && (
        <EmptyState
          type="no-exact-match"
          title="No Exact Hardware Match in Catalog"
          description={conflictExplanation}
          details="SmartPick Guarantee: We never silently hide specs or relax constraints to force a recommendation. Review the closest near-matches below, or tap 'Adjust Filters' above to widen your budget ceiling or relax certified ANC."
          actionText="Adjust Filter Criteria"
          onAction={() => setIsEditingConstraints(true)}
          secondaryActionText="Reset Ceiling to ₹1,50,000"
          onSecondaryAction={() => {
            const reset = { category: 'all', budget_max: 150000, must_have_features: [] };
            setRequirements(reset);
            executeRecommendation('', reset);
          }}
        />
      )}

      {/* Top 3 to 5 Recommended Products */}
      {!loading && recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <span>Top {recommendations.length} Recommended Picks</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                Audited Pool: 41
              </span>
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              Ranked with 6-factor deterministic scoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <ProductCard
                key={rec.product.id}
                product={rec.product}
                recommendationData={{
                  match_score: rec.match_score,
                  why_it_fits: rec.why_it_fits,
                  trade_offs: rec.trade_offs,
                  score_breakdown: rec.score_breakdown,
                  is_near_match: false
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Near Matches if 0 or only 1-2 exact picks */}
      {!loading && nearMatches.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-black/[0.08] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{recommendations.length === 0 ? 'Closest Alternative Near-Matches' : 'Also Consider (Near Matches)'}</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold">
                Near Match
              </span>
            </h3>
            <span className="text-xs text-neutral-500 font-mono">Slightly exceeds ceiling or alters 1 non-essential spec</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearMatches.map(rec => (
              <ProductCard
                key={rec.product.id}
                product={rec.product}
                recommendationData={{
                  match_score: rec.match_score,
                  why_it_fits: rec.why_it_fits,
                  trade_offs: rec.trade_offs,
                  score_breakdown: rec.score_breakdown,
                  is_near_match: true
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
