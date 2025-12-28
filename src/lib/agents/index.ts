// Core Agent System Architecture
// This implements the autonomous agentic reasoning framework

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to parse JSON fields from wellness profile (SQLite compatibility)
function parseWellnessProfile(profile: any) {
  if (!profile) return null;
  return {
    ...profile,
    secondaryIntents: typeof profile.secondaryIntents === 'string' ? JSON.parse(profile.secondaryIntents) : profile.secondaryIntents,
    barriers: typeof profile.barriers === 'string' ? JSON.parse(profile.barriers) : profile.barriers,
    preferredActivities: typeof profile.preferredActivities === 'string' ? JSON.parse(profile.preferredActivities) : profile.preferredActivities,
    historicalFailures: typeof profile.historicalFailures === 'string' ? JSON.parse(profile.historicalFailures) : profile.historicalFailures,
  };
}

// ===== Base Agent Interface =====
export interface AgentContext {
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface AgentOutput {
  success: boolean;
  reasoning: string;
  action: any;
  confidence: number;
  metadata?: any;
}

// ===== Abstract Base Agent =====
export abstract class BaseAgent {
  protected name: string;
  protected systemPrompt: string;

  constructor(name: string, systemPrompt: string) {
    this.name = name;
    this.systemPrompt = systemPrompt;
  }

  // Core agentic reasoning method
  protected async reason(
    context: AgentContext,
    prompt: string,
    temperature: number = 0.7
  ): Promise<AgentOutput> {
    const startTime = Date.now();

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        temperature,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const executionTime = Date.now() - startTime;

      // Log agent activity
      await this.logActivity(context, prompt, result, executionTime);

      return {
        success: true,
        reasoning: result.reasoning || '',
        action: result.action || {},
        confidence: result.confidence || 0.7,
        metadata: result.metadata,
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return {
        success: false,
        reasoning: `Error in ${this.name}: ${error}`,
        action: {},
        confidence: 0,
      };
    }
  }

  // Log agent reasoning for transparency and improvement
  protected async logActivity(
    context: AgentContext,
    input: any,
    output: any,
    executionTime: number
  ) {
    await prisma.agentLog.create({
      data: {
        agentType: this.name,
        action: output.action?.type || 'reasoning',
        input: JSON.stringify(typeof input === 'string' ? { prompt: input } : input),
        reasoning: JSON.stringify(output),
        output: JSON.stringify(output.action || {}),
        executionTime,
        userId: context.userId,
      },
    });
  }

  // Abstract method each agent must implement
  abstract execute(context: AgentContext): Promise<AgentOutput>;
}

// ===== Module 2: Goal Formulation Agent =====
export class GoalFormulationAgent extends BaseAgent {
  constructor() {
    super(
      'goal-formulation',
      `You are an expert Goal Formulation Agent in an adaptive wellness AI system.

Your role is to transform vague user intentions into structured, sustainable, and failure-tolerant goals.

Core Principles:
1. Goals must SURVIVE failure, not collapse after it
2. Optimize for consistency over intensity
3. Respect user constraints (time, energy, routine)
4. Design goals with built-in recovery mechanisms
5. Create sub-goals for complex ambitions

You must respond in JSON format with:
{
  "reasoning": "your analysis of the user's intent and constraints",
  "action": {
    "type": "create_goal",
    "goal": {
      "title": "clear, motivating goal title",
      "description": "detailed goal description",
      "type": "fitness|nutrition|sleep|stress",
      "specific": "what exactly will be done",
      "measurable": "how progress is measured",
      "achievable": "why this is realistic given constraints",
      "relevant": "why this matters to the user",
      "timeBound": "timeline with milestones",
      "targetValue": number,
      "unit": "steps|minutes|kg|etc",
      "allowedMisses": number,
      "recoveryStrategy": "how to recover from missed days",
      "fallbackGoal": "easier version if struggling"
    }
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "adherenceRisk": "low|medium|high",
    "estimatedDifficulty": "easy|moderate|hard",
    "suggestedSubGoals": []
  }
}

CRITICAL: Never create unrealistic or unsustainable goals. Always consider the user's history of failures.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { userId, data } = context;

    // Fetch user wellness profile
    const rawProfile = await prisma.wellnessProfile.findUnique({
      where: { userId },
    });

    const profile = parseWellnessProfile(rawProfile);

    if (!profile) {
      return {
        success: false,
        reasoning: 'No wellness profile found',
        action: {},
        confidence: 0,
      };
    }

    const prompt = `
User Intent: ${data.intent || profile.primaryIntent}
Available Time: ${profile.availableTime} minutes/day
Energy Level: ${profile.energyLevel}
Current Routine: ${profile.currentRoutine}
Barriers: ${profile.barriers.join(', ')}
Motivation Style: ${profile.motivationStyle}
Preferred Activities: ${profile.preferredActivities.join(', ')}
Adherence Risk: ${profile.adherenceRisk}
Historical Failures: ${profile.historicalFailures.join('; ')}

Additional Context: ${JSON.stringify(data.context || {})}

Transform this into a sustainable, failure-tolerant goal that maximizes the probability of long-term adherence.
`;

    return await this.reason(context, prompt);
  }
}

// ===== Module 3: Planning Agent =====
export class PlanningAgent extends BaseAgent {
  constructor() {
    super(
      'planning',
      `You are an expert Planning Agent in an adaptive wellness AI system.

Your role is to generate multi-step wellness plans optimized for CONSISTENCY over intensity.

Core Principles:
1. Balance ambition vs sustainability
2. Pre-generate fallback and recovery plans
3. Estimate cognitive and physical load
4. Design progressive difficulty
5. Build in rest and recovery

You must respond in JSON format with:
{
  "reasoning": "your analysis of the goal and user constraints",
  "action": {
    "type": "create_plan",
    "plan": {
      "title": "plan name",
      "description": "plan overview",
      "startDate": "ISO date",
      "endDate": "ISO date",
      "strategyType": "gradual|intensive|maintenance",
      "activities": {
        "week1": [{"day": 1, "activity": "...", "duration": 30, "load": 5}],
        // ... structured activities
      },
      "physicalLoad": 0-10,
      "cognitiveLoad": 0-10,
      "sustainabilityScore": 0-10,
      "fallbackPlan": {...},
      "recoveryPlan": {...},
      "progressionRules": {...},
      "regressionRules": {...}
    }
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "estimatedCompletionRate": "percentage",
    "keyRisks": [],
    "mitigationStrategies": []
  }
}

CRITICAL: Plans must be adaptive and forgiving. Failure to complete a day should not derail the entire plan.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { userId, data } = context;

    // Fetch goal and profile
    const [goal, rawProfile] = await Promise.all([
      prisma.goal.findUnique({ where: { id: data.goalId } }),
      prisma.wellnessProfile.findUnique({ where: { userId } }),
    ]);

    const profile = parseWellnessProfile(rawProfile);

    if (!goal || !profile) {
      return {
        success: false,
        reasoning: 'Goal or profile not found',
        action: {},
        confidence: 0,
      };
    }

    const prompt = `
Goal: ${goal.title}
Description: ${goal.description}
Target: ${goal.targetValue} ${goal.unit}
Timeline: ${goal.timeBound}
Allowed Misses: ${goal.allowedMisses} per week

User Constraints:
- Available Time: ${profile.availableTime} minutes/day
- Energy Level: ${profile.energyLevel}
- Planning Preference: ${profile.planningPreference}
- Adherence Risk: ${profile.adherenceRisk}

Create a ${data.duration || 4}-week adaptive plan that maximizes long-term adherence.
`;

    return await this.reason(context, prompt);
  }
}

// ===== Module 4: Monitoring Agent =====
export class MonitoringAgent extends BaseAgent {
  constructor() {
    super(
      'monitoring',
      `You are an expert Monitoring Agent in an adaptive wellness AI system.

Your role is to track behavioral TRAJECTORIES, not just isolated metrics.

Core Principles:
1. Identify patterns and trends over time
2. Detect early warning signs of burnout
3. Recognize successful streaks
4. Flag deviations that require adaptation
5. Assess adherence quality, not just quantity

You must respond in JSON format with:
{
  "reasoning": "your analysis of the user's behavioral trajectory",
  "action": {
    "type": "monitoring_report",
    "trajectory": "improving|stable|declining",
    "adherenceScore": 0-100,
    "streakCount": number,
    "consecutiveMisses": number,
    "signals": {
      "burnoutRisk": 0-100,
      "motivationLevel": "low|medium|high",
      "energyTrend": "increasing|stable|decreasing",
      "consistencyScore": 0-100
    },
    "deviations": [
      {"type": "missed|partial|exceeded", "date": "...", "impact": "low|medium|high"}
    ],
    "recommendations": []
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "requiresAdaptation": boolean,
    "urgency": "low|medium|high"
  }
}

CRITICAL: Focus on trajectories and patterns, not single data points.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { userId, data } = context;

    // Fetch recent monitoring data (last 14 days)
    const recentData = await prisma.monitoringData.findMany({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'desc' },
    });

    const prompt = `
Analyze the following behavioral data from the last 14 days:

${recentData
  .map(
    (d) => `
Date: ${d.date.toISOString()}
Activity: ${d.activityType}
Completed: ${d.completed}
Energy: ${d.energyLevel}
Motivation: ${d.motivation}
Difficulty: ${d.difficulty}
Notes: ${d.notes || 'none'}
`
  )
  .join('\n---\n')}

Provide a comprehensive trajectory analysis and identify any concerning patterns or positive trends.
`;

    return await this.reason(context, prompt);
  }
}

// ===== Module 5: Decision & Adaptation Agent =====
export class AdaptationAgent extends BaseAgent {
  constructor() {
    super(
      'adaptation',
      `You are an expert Decision & Adaptation Agent in an adaptive wellness AI system.

Your role is to AUTONOMOUSLY reason about when and how to adapt plans when reality diverges from expectations.

Core Principles:
1. Detect meaningful deviations (not noise)
2. Determine root causes
3. Decide on appropriate adaptations
4. Act autonomously when confidence is high
5. Seek user input when uncertain

You must respond in JSON format with:
{
  "reasoning": "your analysis of why adaptation is needed",
  "action": {
    "type": "adapt_plan|adjust_goal|change_strategy|pause|continue",
    "autonomous": boolean,
    "changes": {
      // specific adaptations to make
    },
    "rationale": "user-friendly explanation",
    "expectedImpact": "what should improve"
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "detectedIssue": "burnout|too_easy|external_factors|etc",
    "triggerType": "deviation|stagnation|success",
    "urgency": "low|medium|high",
    "requiresUserApproval": boolean
  }
}

CRITICAL: Only take autonomous action when confidence > 0.75. Otherwise, recommend and seek approval.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { userId, data } = context;

    const prompt = `
Monitoring Report:
${JSON.stringify(data.monitoringReport, null, 2)}

Current Plan:
${JSON.stringify(data.currentPlan, null, 2)}

Current Goal:
${JSON.stringify(data.currentGoal, null, 2)}

User Profile:
${JSON.stringify(data.profile, null, 2)}

Determine if adaptation is needed, and if so, what specific changes should be made.
If you recommend changes, provide clear reasoning that the user will understand.
`;

    return await this.reason(context, prompt, 0.5); // Lower temperature for more consistent decisions
  }
}

// ===== Module 6: Reflection Engine =====
export class ReflectionAgent extends BaseAgent {
  constructor() {
    super(
      'reflection',
      `You are an expert Reflection Engine in an adaptive wellness AI system.

Your role is to enable META-COGNITION by comparing intended vs actual behavior and extracting deep insights.

Core Principles:
1. Compare what was planned vs what happened
2. Identify root causes, not surface reasons
3. Recognize patterns across multiple cycles
4. Update internal reasoning heuristics
5. Generate actionable lessons

You must respond in JSON format with:
{
  "reasoning": "your meta-cognitive analysis",
  "action": {
    "type": "reflection_report",
    "comparison": {
      "intended": "what was planned",
      "actual": "what happened",
      "variance": "percentage or description"
    },
    "successFactors": [],
    "failureFactors": [],
    "externalFactors": [],
    "patterns": [],
    "rootCauses": [],
    "lessonsLearned": [],
    "heuristicUpdates": {
      // updates to improve future reasoning
    },
    "recommendations": []
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "reflectionQuality": "surface|moderate|deep",
    "actionableInsights": number
  }
}

CRITICAL: Go beyond surface-level analysis. Find the WHY behind behaviors.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { userId, data } = context;

    const prompt = `
Reflection Period: ${data.periodStart} to ${data.periodEnd}

Intended Behavior (from plan):
${JSON.stringify(data.intended, null, 2)}

Actual Behavior (from monitoring):
${JSON.stringify(data.actual, null, 2)}

Previous Reflections:
${JSON.stringify(data.previousReflections || [], null, 2)}

Conduct a deep reflection on this period. Identify patterns, root causes, and generate actionable insights.
`;

    return await this.reason(context, prompt);
  }
}

// ===== Module 7: Explainability Agent =====
export class ExplainabilityAgent extends BaseAgent {
  constructor() {
    super(
      'explainability',
      `You are an expert Explainability Agent in an adaptive wellness AI system.

Your role is to maintain USER TRUST by explaining system reasoning in clear, human-friendly language.

Core Principles:
1. Transparency > opacity
2. Use simple, jargon-free language
3. Explain WHY, not just WHAT
4. Connect decisions to user context
5. Acknowledge uncertainty

You must respond in JSON format with:
{
  "reasoning": "your approach to explaining this decision",
  "action": {
    "type": "explanation",
    "title": "brief headline",
    "summary": "1-2 sentence overview",
    "details": "comprehensive explanation",
    "why": "why this decision was made",
    "userContext": "how this relates to your situation",
    "alternatives": "other options considered",
    "uncertainty": "what we're not sure about",
    "userControl": "what you can change"
  },
  "confidence": 0.0-1.0,
  "metadata": {
    "clarityScore": 0-10,
    "trustBuilding": boolean
  }
}

CRITICAL: Never use AI jargon. Write like a knowledgeable friend, not a robot.`
    );
  }

  async execute(context: AgentContext): Promise<AgentOutput> {
    const { data } = context;

    const prompt = `
System Decision:
${JSON.stringify(data.decision, null, 2)}

User Context:
${JSON.stringify(data.userContext, null, 2)}

Explain this decision in clear, human-friendly language that builds trust and understanding.
`;

    return await this.reason(context, prompt);
  }
}

// ===== Agent Orchestrator =====
export class AgentOrchestrator {
  private agents: Map<string, BaseAgent>;

  constructor() {
    this.agents = new Map([
      ['goal-formulation', new GoalFormulationAgent()],
      ['planning', new PlanningAgent()],
      ['monitoring', new MonitoringAgent()],
      ['adaptation', new AdaptationAgent()],
      ['reflection', new ReflectionAgent()],
      ['explainability', new ExplainabilityAgent()],
    ]);
  }

  async executeAgent(
    agentType: string,
    context: AgentContext
  ): Promise<AgentOutput> {
    const agent = this.agents.get(agentType);

    if (!agent) {
      throw new Error(`Agent type '${agentType}' not found`);
    }

    return await agent.execute(context);
  }

  // Cognitive cycle: Observe → Reason → Plan → Act → Reflect
  async cognitiveCycle(userId: string) {
    const context: AgentContext = { userId, timestamp: new Date() };

    // 1. Observe (Monitoring Agent)
    const monitoring = await this.executeAgent('monitoring', {
      ...context,
      data: {},
    });

    // 2. Reason (Adaptation Agent)
    if (monitoring.metadata?.requiresAdaptation) {
      const adaptation = await this.executeAgent('adaptation', {
        ...context,
        data: { monitoringReport: monitoring },
      });

      // 3. Act (if autonomous and confident)
      if (adaptation.action.autonomous && adaptation.confidence > 0.75) {
        // Implement adaptation
        // ...
      }

      // 4. Explain
      await this.executeAgent('explainability', {
        ...context,
        data: { decision: adaptation },
      });
    }

    // 5. Reflect (weekly)
    // Scheduled reflection logic here
  }
}

export const agentOrchestrator = new AgentOrchestrator();
