// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Curve and Curvature Analysis Utilities leveraging bezier-rs (from Graphite)

use bezier_rs::{Bezier, TValue};
use glam::DVec2;

#[derive(Debug, Clone, Copy)]
pub struct CurvatureSample {
    pub point: DVec2,
    pub normal: DVec2,
    pub curvature: f64,
    pub comb_end: DVec2,
}

/// Compute curvature comb samples along a Bezier curve segment.
/// Useful for visual curvature analysis (inflection points, smooth transitions).
pub fn sample_curvature_comb(
    bezier: &Bezier,
    sample_count: usize,
    comb_scale: f64,
) -> Vec<CurvatureSample> {
    if sample_count == 0 {
        return Vec::new();
    }

    let mut samples = Vec::with_capacity(sample_count);
    let step = 1.0 / (sample_count.max(2) - 1) as f64;

    for i in 0..sample_count {
        let t = (i as f64 * step).clamp(0.0, 1.0);
        let t_val = TValue::Parametric(t);

        let pt = bezier.evaluate(t_val);
        let normal = bezier.normal(t_val).unwrap_or(DVec2::ZERO);
        let curvature = bezier.curvature(t_val);

        let comb_length = curvature * comb_scale;
        let comb_end = pt + normal * comb_length;

        samples.push(CurvatureSample {
            point: pt,
            normal,
            curvature,
            comb_end,
        });
    }

    samples
}

/// Compute an offset curve from a sequence of Bezier segments.
/// Returns offset point pairs along the normal of the curve.
pub fn compute_curve_offsets(
    beziers: &[Bezier],
    distance: f64,
    steps_per_segment: usize,
) -> Vec<DVec2> {
    let mut offset_points = Vec::new();

    for bezier in beziers {
        let step = 1.0 / steps_per_segment.max(2) as f64;
        for i in 0..=steps_per_segment {
            let t = (i as f64 * step).clamp(0.0, 1.0);
            let t_val = TValue::Parametric(t);
            let pt = bezier.evaluate(t_val);
            if let Some(norm) = bezier.normal(t_val) {
                offset_points.push(pt + norm * distance);
            } else {
                offset_points.push(pt);
            }
        }
    }

    offset_points
}

/// Computes total arclength approximation of a sequence of Beziers.
pub fn calculate_path_arclength(beziers: &[Bezier], intervals: usize) -> f64 {
    beziers
        .iter()
        .map(|b| {
            let step = 1.0 / intervals.max(1) as f64;
            let mut len = 0.0;
            let mut prev = b.evaluate(TValue::Parametric(0.0));
            for i in 1..=intervals {
                let curr = b.evaluate(TValue::Parametric(i as f64 * step));
                len += prev.distance(curr);
                prev = curr;
            }
            len
        })
        .sum()
}
