#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/check', methods=['POST'])
def check():
    content = request.json.get('content', '')
    time.sleep(1.5)
    
    label = 'Suspicious'
    explanation = f'This is a test response for: "{content[:50]}...". The content is being analyzed for potential misinformation.'
    confidence = 0.65
    is_scam = False
    evidence = []
    sources = []
    
    if 'test' in content.lower():
        label = 'Verified'
        explanation = f'This is a test response for: "{content[:50]}...". The information appears to be accurate based on our mock data.'
        confidence = 0.85
        evidence = [
            {'url': 'https://example.com/source1', 'quote': 'This is sample evidence that supports the claim.', 'support': 'supports'},
            {'url': 'https://example.com/source2', 'quote': 'Additional context from a reliable source.', 'support': 'supports'}
        ]
        sources = [
            {'url': 'https://example.com/article1', 'title': 'Reliable Source Article'},
            {'url': 'https://example.com/article2', 'title': 'Another Trusted Source'}
        ]
    elif 'scam' in content.lower() or 'free' in content.lower():
        label = 'Suspicious'
        explanation = f'This is a test response for: "{content[:50]}...". Possible scam indicators detected based on keywords.'
        confidence = 0.75
        is_scam = True
        evidence = [
            {'url': 'https://example.com/scam_alert', 'quote': 'Beware of offers that seem too good to be true.', 'support': 'refutes'}
        ]
        sources = [
            {'url': 'https://example.com/consumer_protection', 'title': 'Consumer Protection Agency'}
        ]
    elif 'fake' in content.lower():
        label = 'Fake'
        explanation = f'This is a test response for: "{content[:50]}...". The claim is likely false based on mock data.'
        confidence = 0.90
        evidence = [
            {'url': 'https://example.com/debunked', 'quote': 'This claim has been widely debunked by experts.', 'support': 'refutes'}
        ]
        sources = [
            {'url': 'https://example.com/fact_checker_org', 'title': 'Fact-Checking Organization'}
        ]
    
    response = {
        'analysis': {
            'label': label,
            'explanation': explanation,
            'confidence': confidence,
            'evidence': evidence
        },
        'scam': {'is_suspicious': is_scam},
        'sources': sources
    }
    return jsonify(response)

@app.route('/feedback', methods=['POST'])
def feedback():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print('Simple test server running on http://127.0.0.1:8081')
    app.run(host='127.0.0.1', port=8081, debug=True)
