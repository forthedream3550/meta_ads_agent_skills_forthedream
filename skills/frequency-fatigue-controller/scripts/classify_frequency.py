#!/usr/bin/env python3
import json
import sys


def pct_change(current, previous):
    if current is None or previous in (None, 0):
        return None
    return (current - previous) / abs(previous)


def classify(data):
    window = data.get('windowDays', 0)
    frequency = data.get('frequency')
    comparison = data.get('comparison') or {}
    if window < 3 or frequency is None:
        return {'state': 'insufficient_evidence', 'signals': ['short_or_incomplete_window']}

    freq_change = pct_change(frequency, comparison.get('frequency'))
    ctr_change = pct_change(data.get('ctr'), comparison.get('ctr'))
    cpr_change = pct_change(data.get('costPerResult'), comparison.get('costPerResult'))
    new_reach = data.get('newReachShare')
    creative_count = data.get('activeCreativeCount')

    signals = []
    if freq_change is not None and freq_change > 0.10:
        signals.append('frequency_rising')
    if ctr_change is not None and ctr_change < -0.15:
        signals.append('response_declining')
    if cpr_change is not None and cpr_change > 0.15:
        signals.append('cost_worsening')
    if new_reach is not None and new_reach < 0.25:
        signals.append('new_reach_low')
    if creative_count is not None and creative_count <= 1:
        signals.append('creative_coverage_thin')

    if not comparison:
        return {'state': 'insufficient_evidence', 'signals': signals + ['comparison_missing']}
    if {'frequency_rising', 'response_declining', 'cost_worsening', 'new_reach_low'}.issubset(signals):
        state = 'creative_fatigue_likely' if 'creative_coverage_thin' in signals else 'audience_saturation_likely'
    elif 'frequency_rising' in signals and not {'response_declining', 'cost_worsening'}.intersection(signals):
        state = 'productive_repetition'
    elif {'response_declining', 'cost_worsening'}.intersection(signals):
        state = 'watch'
    elif frequency < 1.5:
        state = 'underexposed'
    else:
        state = 'productive_repetition'
    return {'state': state, 'signals': signals}


def main():
    data = json.load(sys.stdin)
    print(json.dumps(classify(data), indent=2))


if __name__ == '__main__':
    main()
