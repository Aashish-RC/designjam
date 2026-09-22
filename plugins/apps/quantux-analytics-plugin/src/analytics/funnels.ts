export interface FunnelStep {
  stepIndex: number;
  name: string;
  screenName: string;
  visitors: number;
  dropOffs: number;
  conversionRate: number; // 0 to 100%
  avgTimeSeconds: number;
}

export interface FunnelAnalysis {
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
  bottleneckStep: string;
  steps: FunnelStep[];
}

export function calculateFunnelMetrics(stepsData: Array<{ name: string; screenName: string; visitors: number; avgTimeSeconds: number }>): FunnelAnalysis {
  const steps: FunnelStep[] = [];
  const totalStarted = stepsData.length > 0 ? stepsData[0].visitors : 0;
  let maxDropOff = -1;
  let bottleneck = 'None';

  for (let i = 0; i < stepsData.length; i++) {
    const curr = stepsData[i];
    const nextVisitors = i + 1 < stepsData.length ? stepsData[i + 1].visitors : curr.visitors;
    const dropOffs = curr.visitors - nextVisitors;
    const rate = totalStarted > 0 ? (curr.visitors / totalStarted) * 100 : 0;

    if (dropOffs > maxDropOff) {
      maxDropOff = dropOffs;
      bottleneck = curr.name;
    }

    steps.push({
      stepIndex: i + 1,
      name: curr.name,
      screenName: curr.screenName,
      visitors: curr.visitors,
      dropOffs,
      conversionRate: Math.round(rate * 10) / 10,
      avgTimeSeconds: curr.avgTimeSeconds,
    });
  }

  const totalCompleted = steps.length > 0 ? steps[steps.length - 1].visitors : 0;
  const overallRate = totalStarted > 0 ? (totalCompleted / totalStarted) * 100 : 0;

  return {
    totalStarted,
    totalCompleted,
    overallConversionRate: Math.round(overallRate * 10) / 10,
    bottleneckStep: bottleneck,
    steps,
  };
}
