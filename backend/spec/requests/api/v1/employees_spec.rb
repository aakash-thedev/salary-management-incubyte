require 'rails_helper'

RSpec.describe "Api::V1::Employees", type: :request do
  describe "GET /api/v1/employees" do
    before do
      create_list(:employee, 30, country: "United States")
    end

    it "returns a paginated list of employees" do
      get "/api/v1/employees"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"].length).to eq(25) # default page size
      expect(json["meta"]["total_count"]).to eq(30)
      expect(json["meta"]["total_pages"]).to eq(2)
      expect(json["meta"]["current_page"]).to eq(1)
    end

    it "returns the second page" do
      get "/api/v1/employees", params: { page: 2 }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"].length).to eq(5)
      expect(json["meta"]["current_page"]).to eq(2)
    end

    it "filters employees by country" do
      create(:employee, country: "India", full_name: "Farhan Khan")

      get "/api/v1/employees", params: { country: "India" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"].length).to eq(1)
      expect(json["employees"].first["country"]).to eq("India")
    end

    it "searches employees by name" do
      create(:employee, full_name: "Unique SearchName", country: "Germany")

      get "/api/v1/employees", params: { search: "Unique Search" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"].length).to eq(1)
      expect(json["employees"].first["full_name"]).to eq("Unique SearchName")
    end

    it "filters employees by employment type" do
      create(:employee, employment_type: "contract", full_name: "Contractor Joe", country: "Canada")

      get "/api/v1/employees", params: { employment_type: "contract" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"].length).to eq(1)
      expect(json["employees"].first["employment_type"]).to eq("contract")
    end

    it "returns an empty list when no employees match" do
      get "/api/v1/employees", params: { country: "Antarctica" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"]).to be_empty
    end
  end

  describe "GET /api/v1/employees/:id" do
    it "returns a single employee" do
      employee = create(:employee, full_name: "Jane Doe", salary: 95_000)

      get "/api/v1/employees/#{employee.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employee"]["full_name"]).to eq("Jane Doe")
      expect(json["employee"]["salary"]).to eq("95000.0")
    end

    it "includes salary comparison data" do
      create(:employee, country: "Germany", job_title: "Designer", salary: 60_000)
      create(:employee, country: "Germany", job_title: "Designer", salary: 80_000)
      employee = create(:employee, full_name: "Target", country: "Germany", job_title: "Designer", salary: 70_000)

      get "/api/v1/employees/#{employee.id}"

      json = JSON.parse(response.body)
      comparison = json["comparison"]

      expect(comparison).to be_present
      expect(comparison["country_avg_salary"]).to eq(70_000.0)
      expect(comparison["country_headcount"]).to eq(3)
      expect(comparison["role_avg_salary"]).to eq(70_000.0)
      expect(comparison["role_headcount"]).to eq(3)
    end

    it "returns 404 for a non-existent employee" do
      get "/api/v1/employees/99999"

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json["error"]).to be_present
    end
  end

  describe "POST /api/v1/employees" do
    let(:valid_params) do
      {
        employee: {
          full_name: "New Hire",
          job_title: "DevOps Engineer",
          department: "Infrastructure",
          country: "Canada",
          salary: 85_000,
          currency: "CAD",
          employment_type: "full_time",
          hired_on: "2025-06-01"
        }
      }
    end

    it "creates an employee with valid params" do
      expect {
        post "/api/v1/employees", params: valid_params
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json["employee"]["full_name"]).to eq("New Hire")
      expect(json["employee"]["country"]).to eq("Canada")
    end

    it "returns validation errors with invalid params" do
      post "/api/v1/employees", params: { employee: { full_name: "" } }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]).to be_present
    end

    it "returns validation error for negative salary" do
      post "/api/v1/employees", params: { employee: valid_params[:employee].merge(salary: -500) }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]["salary"]).to be_present
    end
  end

  describe "PUT /api/v1/employees/:id" do
    let!(:employee) { create(:employee, full_name: "Old Name", salary: 60_000) }

    it "updates an employee with valid params" do
      put "/api/v1/employees/#{employee.id}", params: { employee: { full_name: "New Name", salary: 70_000 } }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employee"]["full_name"]).to eq("New Name")
      expect(json["employee"]["salary"]).to eq("70000.0")
    end

    it "returns validation errors with invalid params" do
      put "/api/v1/employees/#{employee.id}", params: { employee: { salary: -100 } }

      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json["errors"]["salary"]).to be_present
    end

    it "returns 404 for a non-existent employee" do
      put "/api/v1/employees/99999", params: { employee: { full_name: "Ghost" } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    let!(:employee) { create(:employee) }

    it "deletes an employee" do
      expect {
        delete "/api/v1/employees/#{employee.id}"
      }.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "returns 404 for a non-existent employee" do
      delete "/api/v1/employees/99999"

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET /api/v1/employees/countries" do
    before do
      create(:employee, country: "United States")
      create(:employee, country: "India")
      create(:employee, country: "India") # duplicate
      create(:employee, country: "Germany")
    end

    it "returns a sorted list of distinct countries" do
      get "/api/v1/employees/countries"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["countries"]).to eq(["Germany", "India", "United States"])
    end
  end

  describe "GET /api/v1/employees/job_titles" do
    before do
      create(:employee, job_title: "Software Engineer")
      create(:employee, job_title: "Product Manager")
      create(:employee, job_title: "Software Engineer") # duplicate
    end

    it "returns a sorted list of distinct job titles" do
      get "/api/v1/employees/job_titles"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["job_titles"]).to eq(["Product Manager", "Software Engineer"])
    end
  end
end
