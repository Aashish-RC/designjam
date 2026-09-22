export interface VariantMetrics {
  variantId: 'A' | 'B';
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number; // percentage
  bounceRate: number;
  avgDurationSeconds: number;
}

export interface ABTestReport {
  testName: string;
  variantA: VariantMetrics;
  variantB: VariantMetrics;
  winner: 'A' | 'B' | 'Inconclusive';
  improvementPercentage: number;
  confidence: number; // e.g. 95%
}

export function evaluateABTest(
  a: { visitors: number; conversions: number; bounces: number; duration: number },
  b: { visitors: number; conversions: number; bounces: number; duration: number },
  testName: string = 'Checkout CTA Test'
): ABTestReport {
  const rateA = a.visitors > 0 ? (a.conversions / a.visitors) * 100 : 0;
  const rateB = b.visitors > 0 ? (b.conversions / b.visitors) * 100 : 0;

  const bounceA = a.visitors > 0 ? (a.bounces / a.visitors) * 100 : 0;
  const bounceB = b.visitors > 0 ? (b.bounces / b.visitors) * 100 : 0;

  const diff = rateB - rateA;
  const improvement = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;

  let winner: 'A' | 'B' | 'Inconclusive' = 'Inconclusive';
  if (diff > 1.5 && b.visitors > 50) winner = 'B';
  else if (diff < -1.5 && a.visitors > 50) winner = 'A';

  return {
    testName,
    variantA: {
      variantId: 'A',
      name: 'Variant A (Control)',
      visitors: a.visitors,
      conversions: a.conversions,
      conversionRate: Math.round(rateA * 10) / 10,
      bounceRate: Math.round(bounceA * 10) / 10,
      avgDurationSeconds: a.duration,
    },
    variantB: {
      variantId: 'B',
      name: 'Variant B (Test)',
      visitors: b.visitors,
      conversions: b.conversions,
      conversionRate: Math.round(rateB * 10) / 10,
      bounceRate: Math.round(bounceB * 10) / 10,
      avgDurationSeconds: b.duration,
    },
    winner,
    improvementPercentage: Math.round(improvement * 10) / 10,
    confidence: winner !== 'Inconclusive' ? 95 : 68,
  };
}
