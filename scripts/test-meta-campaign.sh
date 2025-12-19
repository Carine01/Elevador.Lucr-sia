#!/bin/bash

echo "🧪 Testando criação de campanha Meta Ads..."

WEBHOOK_URL="http://localhost:5678/webhook/meta-campaign"

# Payload de teste
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_name": "Teste Campanha - Estética",
    "objective": "OUTCOME_TRAFFIC",
    "daily_budget": 50,
    "target_audience": {
      "age_min": 25,
      "age_max": 55,
      "genders": [2],
      "geo_locations": {
        "countries": ["BR"],
        "cities": [
          {"key": "São Paulo", "radius": 50, "distance_unit": "kilometer"}
        ]
      },
      "interests": [
        {"id": "6003139266461", "name": "Beauty"},
        {"id": "6003189043461", "name": "Skin care"}
      ]
    }
  }'

echo "\n✅ Teste enviado! Verifique no Meta Ads Manager."
