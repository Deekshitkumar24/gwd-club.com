'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QA_AGENTS, SAMPLE_RUN_FAILED, SAMPLE_RUN_PASSED, BugFinding, LogEntry, AgentExecutionState } from '@/data/projectGuardData';

export type SimulationScenario = 'fail' | 'pass';

const AGENT_STEP_SCRIPTS: Record<string, { actions: string[]; logs: { level: LogEntry['level']; text: string }[] }> = {
  astra: {
    actions: [
      'Initializing headless Chromium cluster with isolated storage context...',
      'Mapping client-side state machine: 14 interactive routes detected',
      'Fuzzing authentication state transitions with expired session tokens...',
      'Testing multi-step billing checkout with edge payment methods...',
      'Injecting cancellation event into 3DS iframe modal overlay...',
      'Evaluating checkout button state persistence after modal dismissal...',
      'Synthesizing final behavioral flow report and journey coverage metrics...',
    ],
    logs: [
      { level: 'info', text: 'Spawning isolated Chromium browser instance (PID: 8841)' },
      { level: 'action', text: 'Crawling route hierarchy: /login -> /dashboard -> /checkout' },
      { level: 'action', text: 'Executing form fuzzing with 42 edge-case email and card strings' },
      { level: 'action', text: 'Triggering 3DS payment challenge sequence with test card 4000-0027-6000-3184' },
      { level: 'finding', text: 'DEFECT CAUGHT: Checkout button remains disabled with isLoading: true after 3DS cancellation' },
      { level: 'action', text: 'Capturing DOM mutation snapshot and network waterfall trace' },
      { level: 'info', text: 'Completed 420 behavioral tests. 1 Critical blocker flagged.' },
    ],
  },
  kinesis: {
    actions: [
      'Spinning up 36-viewport browser matrix (WebKit, Chromium, Gecko)...',
      'Capturing baseline DOM layout geometries at 320px, 393px, 768px, 1440px...',
      'Executing subpixel layout diffing against design token specifications...',
      'Inspecting WebKit flexbox rendering on iOS 18 Safari simulation...',
      'Detecting element collapsing: .stripe-card-container height computed to 0px...',
      'Measuring Cumulative Layout Shift (CLS) during async font swap...',
      'Synthesizing cross-engine rendering matrix report...',
    ],
    logs: [
      { level: 'info', text: 'Connected to WebKit rendering engine (v619.1.1)' },
      { level: 'action', text: 'Measuring viewport 393x852 (iPhone 15 Pro simulation)' },
      { level: 'action', text: 'Testing flexbox height propagation on nested iframe containers' },
      { level: 'finding', text: 'VISUAL COLLAPSE: .stripe-elements-wrapper computed height evaluates to 0px on Safari WebKit' },
      { level: 'action', text: 'Generating annotated pixel diff screenshot with bounding box' },
      { level: 'action', text: 'Auditing WCAG AAA color contrast ratios across dark/light themes' },
      { level: 'info', text: 'Completed 310 viewport checks across 3 engines.' },
    ],
  },
  sentinel: {
    actions: [
      'Cloning Git commit AST diff for PR #412 (9e7b214c)...',
      'Constructing dependency graph for modified src/context/AuthContext.tsx...',
      'Identifying 48 dependent legacy routes with blast-radius analysis...',
      'Exercising plan downgrade workflow for existing multi-seat organizations...',
      'Detecting unhandled null exception on seatAllocation state accessor...',
      'Verifying cookie domain isolation and backward compatibility...',
      'Synthesizing regression impact telemetry...',
    ],
    logs: [
      { level: 'info', text: 'Parsed AST diff: 14 files modified, 3 shared contexts altered' },
      { level: 'action', text: 'Triggering regression suite for billing and team management paths' },
      { level: 'action', text: 'Simulating legacy organization with totalSeats=undefined' },
      { level: 'finding', text: 'REGRESSION DETECTED: TypeError: Cannot read properties of undefined in PlanAdjustmentModal' },
      { level: 'action', text: 'Correlating error stack trace to commit 9e7b214c line 84' },
      { level: 'info', text: 'Completed 540 regression checks. 1 High severity regression identified.' },
    ],
  },
  aegis: {
    actions: [
      'Scanning public DOM for sensitive token leaks in localStorage & cookies...',
      'Fuzzing search inputs and markdown fields with OWASP XSS polyglots...',
      'Verifying CSRF token validation on sensitive state mutation endpoints...',
      'Testing privilege escalation attempts on admin billing settings...',
      'Validating Content-Security-Policy headers and CORS preflight policies...',
      'Auditing JWT signature expiration and automatic logout triggers...',
      'Synthesizing client-side security boundary assessment...',
    ],
    logs: [
      { level: 'info', text: 'Auditing client storage boundaries (localStorage, sessionStorage, IndexedDB)' },
      { level: 'action', text: 'Injected 68 SVG, script, and markdown XSS vectors into form inputs' },
      { level: 'success', text: 'All 68 injection payloads sanitized successfully by DOMPurify filter' },
      { level: 'action', text: 'Testing unauthorized mutation to /api/org/billing-role under Member role' },
      { level: 'success', text: 'Server returned 403 Forbidden with proper client state isolation' },
      { level: 'info', text: 'Completed 380 security checks. 0 vulnerabilities detected.' },
    ],
  },
  chronos: {
    actions: [
      'Connecting to Chrome DevTools Protocol performance timeline observer...',
      'Comparing SSR HTML payload against client hydrated DOM tree...',
      'Detecting text mismatch: Server "$" vs Client "EUR 99,00" localized string...',
      'Measuring Interaction to Next Paint (INP) under synthetic 4x CPU throttle...',
      'Tracking memory heap allocation over 50 rapid route navigations...',
      'Inspecting bundle chunks for unminified or duplicate dependencies...',
      'Synthesizing hydration and performance health audit...',
    ],
    logs: [
      { level: 'info', text: 'Attached CDP Performance Timeline listener' },
      { level: 'action', text: 'Auditing server-rendered HTML versus client hydration tree' },
      { level: 'finding', text: 'HYDRATION WARNING: Server "$" vs Client "EUR 99,00" mismatch on /pricing' },
      { level: 'action', text: 'Simulating 50 rapid navigations between /dashboard and /settings' },
      { level: 'success', text: 'Heap memory stabilized at 34.2MB without listener leaks' },
      { level: 'info', text: 'Completed 490 performance profiling checks.' },
    ],
  },
  cerberus: {
    actions: [
      'Standing by for parallel agent telemetry stream...',
      'Aggregating live defect signals from Astra, Kinesis, Sentinel, Aegis, Chronos...',
      'Applying Zero-Critical-Defect Release Gate Policy...',
      'Evaluating deployment blocking criteria: 2 Critical, 1 High defects flagged...',
      'Formulating plain-language executive release explanation...',
      'Generating signed cryptographic release gate decision token...',
      'Issuing final authoritative verdict: RELEASE BLOCKED...',
    ],
    logs: [
      { level: 'info', text: 'Release Gate Synthesizer initialized. Policy: ZERO_CRITICAL_DEFECTS' },
      { level: 'action', text: 'Receiving live telemetry stream from 5 worker agents' },
      { level: 'action', text: 'Correlating defect impact against revenue and usability thresholds' },
      { level: 'error', text: 'GATE TRIGGERED: 2 Critical defects exceed zero-tolerance threshold' },
      { level: 'action', text: 'Locking deployment pipeline. Webhook dispatched to CI/CD runner.' },
      { level: 'finding', text: 'FINAL VERDICT: RELEASE BLOCKED (Integrity Token: PG-BLK-9842)' },
    ],
  },
};

export function useQARunSimulation() {
  const [scenario, setScenario] = useState<SimulationScenario>('fail');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [agentStates, setAgentStates] = useState<Record<string, AgentExecutionState>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeFindings, setActiveFindings] = useState<BugFinding[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepIndexRef = useRef<Record<string, number>>({});

  const activeScenarioData = scenario === 'fail' ? SAMPLE_RUN_FAILED : SAMPLE_RUN_PASSED;

  // Initialize or reset simulation
  const resetSimulation = useCallback((newScenario?: SimulationScenario) => {
    const sc = newScenario || scenario;
    if (newScenario) setScenario(newScenario);

    const initialStates: Record<string, AgentExecutionState> = {};
    const initialStepIndices: Record<string, number> = {};

    QA_AGENTS.forEach((agent) => {
      initialStates[agent.id] = {
        agentId: agent.id,
        status: 'pending',
        progress: 0,
        currentAction: 'Waiting in execution queue...',
        completedSteps: 0,
        totalSteps: AGENT_STEP_SCRIPTS[agent.id]?.actions.length || 7,
        findingsCount: 0,
      };
      initialStepIndices[agent.id] = 0;
    });

    stepIndexRef.current = initialStepIndices;
    setAgentStates(initialStates);
    setLogs([]);
    setActiveFindings([]);
    setElapsedSeconds(0);
    setOverallProgress(0);
    setIsComplete(false);
    setIsPaused(false);
    setIsRunning(true);
  }, [scenario]);

  useEffect(() => {
    resetSimulation();
  }, [resetSimulation]);

  // Main simulation tick
  useEffect(() => {
    if (!isRunning || isPaused || isComplete) return;

    const interval = Math.max(250 / speed, 40);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      setAgentStates((prevStates) => {
        const nextStates = { ...prevStates };
        let allCompleted = true;
        let totalProgressSum = 0;

        QA_AGENTS.forEach((agent, agentIdx) => {
          const state = nextStates[agent.id];
          if (!state) return;

          // Cerberus starts slightly later to simulate aggregation
          const agentDelay = agent.id === 'cerberus' ? 6 : agentIdx * 1.5;

          if (elapsedSeconds < agentDelay) {
            // Still pending
            nextStates[agent.id] = {
              ...state,
              status: 'pending',
              currentAction: `Queued. Awaiting agent container provisioning...`,
            };
            allCompleted = false;
            return;
          }

          // Move to running
          const script = AGENT_STEP_SCRIPTS[agent.id];
          const totalSteps = script?.actions.length || 7;
          const currentStep = stepIndexRef.current[agent.id] || 0;

          if (currentStep < totalSteps) {
            allCompleted = false;
            const progress = Math.min(Math.round(((currentStep + 1) / totalSteps) * 100), 95);
            const currentAction = script?.actions[currentStep] || 'Executing analysis pass...';

            nextStates[agent.id] = {
              ...state,
              status: 'running',
              progress,
              currentAction,
              completedSteps: currentStep + 1,
            };

            // Add corresponding log if available
            if (script?.logs[currentStep]) {
              const logItem = script.logs[currentStep];
              const logEntry: LogEntry = {
                id: `log-${agent.id}-${currentStep}-${Date.now()}`,
                agentId: agent.id,
                timestamp: `+${(elapsedSeconds * 0.4).toFixed(1)}s`,
                level: logItem.level,
                message: logItem.text,
              };

              setLogs((prev) => [logEntry, ...prev.slice(0, 150)]);

              // If log is finding and scenario is 'fail', push bug finding in real-time!
              if (logItem.level === 'finding' && scenario === 'fail') {
                const matchedBug = activeScenarioData.bugs.find((b) => b.agentId === agent.id);
                if (matchedBug) {
                  setActiveFindings((prev) => {
                    if (prev.some((f) => f.id === matchedBug.id)) return prev;
                    return [matchedBug, ...prev];
                  });
                  nextStates[agent.id].findingsCount += 1;
                }
              }
            }

            stepIndexRef.current[agent.id] = currentStep + 1;
          } else {
            // Completed or Failed state
            const shouldFail = scenario === 'fail' && (agent.id === 'astra' || agent.id === 'kinesis' || agent.id === 'sentinel');
            nextStates[agent.id] = {
              ...state,
              status: shouldFail ? 'failed' : 'completed',
              progress: 100,
              currentAction: shouldFail ? 'Terminated with critical defect flags' : 'All test vectors validated successfully',
              completedSteps: totalSteps,
            };
          }

          totalProgressSum += nextStates[agent.id].progress;
        });

        const overall = Math.round(totalProgressSum / QA_AGENTS.length);
        setOverallProgress(overall);

        if (allCompleted && overall >= 100) {
          setIsComplete(true);
          setIsRunning(false);
        }

        return nextStates;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, isComplete, speed, elapsedSeconds, scenario, activeScenarioData]);

  // Jump to complete immediately
  const completeImmediately = useCallback(() => {
    QA_AGENTS.forEach((agent) => {
      const script = AGENT_STEP_SCRIPTS[agent.id];
      stepIndexRef.current[agent.id] = script?.actions.length || 7;
    });

    const finalStates: Record<string, AgentExecutionState> = {};
    QA_AGENTS.forEach((agent) => {
      const shouldFail = scenario === 'fail' && (agent.id === 'astra' || agent.id === 'kinesis' || agent.id === 'sentinel');
      finalStates[agent.id] = {
        agentId: agent.id,
        status: shouldFail ? 'failed' : 'completed',
        progress: 100,
        currentAction: shouldFail ? 'Defect flags surfaced' : 'Execution completed successfully',
        completedSteps: AGENT_STEP_SCRIPTS[agent.id]?.actions.length || 7,
        totalSteps: AGENT_STEP_SCRIPTS[agent.id]?.actions.length || 7,
        findingsCount: shouldFail ? 1 : 0,
      };
    });

    // Populate all logs
    const allLogs: LogEntry[] = [];
    QA_AGENTS.forEach((agent) => {
      const script = AGENT_STEP_SCRIPTS[agent.id];
      script?.logs.forEach((logItem, idx) => {
        allLogs.push({
          id: `log-${agent.id}-${idx}`,
          agentId: agent.id,
          timestamp: `+${(idx * 4.2).toFixed(1)}s`,
          level: logItem.level,
          message: logItem.text,
        });
      });
    });

    setAgentStates(finalStates);
    setLogs(allLogs);
    if (scenario === 'fail') {
      setActiveFindings(SAMPLE_RUN_FAILED.bugs);
    } else {
      setActiveFindings([]);
    }
    setOverallProgress(100);
    setIsComplete(true);
    setIsRunning(false);
  }, [scenario]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return {
    scenario,
    isRunning,
    isPaused,
    isComplete,
    speed,
    elapsedSeconds,
    overallProgress,
    agentStates,
    logs,
    activeFindings,
    activeScenarioData,
    setSpeed,
    togglePause,
    resetSimulation,
    completeImmediately,
  };
}
