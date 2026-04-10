require 'rails_helper'

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    create(:employee, country: "United States", job_title: "Software Engineer", salary: 120_000)
    create(:employee, country: "United States", job_title: "Software Engineer", salary: 80_000)
    create(:employee, country: "United States", job_title: "Product Manager", salary: 110_000)
    create(:employee, country: "India", job_title: "Software Engineer", salary: 30_000)
  end

  describe "GET /api/v1/insights" do
    it "returns salary insights for a given country" do
      get "/api/v1/insights", params: { country: "United States" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)

      expect(json["insights"]["min_salary"]).to eq(80_000.0)
      expect(json["insights"]["max_salary"]).to eq(120_000.0)
      expect(json["insights"]["avg_salary"]).to be_within(0.01).of(103_333.33)
      expect(json["insights"]["headcount"]).to eq(3)
    end

    it "returns the primary currency for the country" do
      get "/api/v1/insights", params: { country: "United States" }

      json = JSON.parse(response.body)
      expect(json["insights"]["currency"]).to eq("USD")
    end

    it "returns salary breakdown by job title" do
      get "/api/v1/insights", params: { country: "United States" }

      json = JSON.parse(response.body)
      breakdown = json["insights"]["salary_by_job_title"]

      se_entry = breakdown.find { |entry| entry["job_title"] == "Software Engineer" }
      expect(se_entry["avg_salary"]).to eq(100_000.0)
      expect(se_entry["headcount"]).to eq(2)
    end

    it "returns top earners for the country" do
      get "/api/v1/insights", params: { country: "United States" }

      json = JSON.parse(response.body)
      top = json["insights"]["top_earners"]

      expect(top.length).to eq(3)
      expect(top.first["salary"]).to eq("120000.0")
    end

    it "returns job title average when job_title param is provided" do
      get "/api/v1/insights", params: { country: "United States", job_title: "Software Engineer" }

      json = JSON.parse(response.body)
      expect(json["insights"]["job_title_avg_salary"]).to eq(100_000.0)
    end

    it "returns 400 when country param is missing" do
      get "/api/v1/insights"

      expect(response).to have_http_status(:bad_request)
      json = JSON.parse(response.body)
      expect(json["error"]).to include("country")
    end

    it "returns empty insights for a country with no employees" do
      get "/api/v1/insights", params: { country: "Antarctica" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["insights"]["headcount"]).to eq(0)
      expect(json["insights"]["min_salary"]).to be_nil
    end
  end
end
