require 'rails_helper'

RSpec.describe SalaryInsightsService do
  before(:each) do
    # Employees in United States
    create(:employee, full_name: "Alice Johnson", country: "United States", job_title: "Software Engineer", salary: 120_000, employment_type: "full_time", department: "Engineering")
    create(:employee, full_name: "Bob Smith", country: "United States", job_title: "Software Engineer", salary: 80_000, employment_type: "contract", department: "Engineering")
    create(:employee, full_name: "Carol Davis", country: "United States", job_title: "Product Manager", salary: 110_000, employment_type: "full_time", department: "Product")
    create(:employee, full_name: "Dave Wilson", country: "United States", job_title: "Data Analyst", salary: 70_000, employment_type: "part_time", department: "Data")
    create(:employee, full_name: "Eve Martinez", country: "United States", job_title: "HR Specialist", salary: 60_000, employment_type: "full_time", department: nil)

    # Employees in India
    create(:employee, full_name: "Farhan Khan", country: "India", job_title: "Software Engineer", salary: 30_000, employment_type: "full_time", department: "Engineering")
    create(:employee, full_name: "Geeta Patel", country: "India", job_title: "Software Engineer", salary: 25_000, employment_type: "contract", department: "Engineering")
    create(:employee, full_name: "Hari Sharma", country: "India", job_title: "Data Analyst", salary: 20_000, employment_type: "full_time", department: "Data")
  end

  describe "#country_insights" do
    context "for United States" do
      let(:insights) { described_class.new(country: "United States").country_insights }

      it "returns the minimum salary" do
        expect(insights[:min_salary]).to eq(60_000.0)
      end

      it "returns the maximum salary" do
        expect(insights[:max_salary]).to eq(120_000.0)
      end

      it "returns the average salary" do
        # (120000 + 80000 + 110000 + 70000 + 60000) / 5 = 88000
        expect(insights[:avg_salary]).to eq(88_000.0)
      end

      it "returns the median salary" do
        # Sorted: 60000, 70000, 80000, 110000, 120000 → median = 80000
        expect(insights[:median_salary]).to eq(80_000.0)
      end

      it "returns the total headcount" do
        expect(insights[:headcount]).to eq(5)
      end
    end

    context "for India" do
      let(:insights) { described_class.new(country: "India").country_insights }

      it "returns correct min, max, avg for a different country" do
        expect(insights[:min_salary]).to eq(20_000.0)
        expect(insights[:max_salary]).to eq(30_000.0)
        expect(insights[:headcount]).to eq(3)
      end
    end

    context "for a country with no employees" do
      let(:insights) { described_class.new(country: "Antarctica").country_insights }

      it "returns zero headcount and nil salary metrics" do
        expect(insights[:headcount]).to eq(0)
        expect(insights[:min_salary]).to be_nil
        expect(insights[:max_salary]).to be_nil
        expect(insights[:avg_salary]).to be_nil
      end
    end
  end

  describe "#job_title_avg_salary" do
    it "returns the average salary for a job title in a country" do
      # US Software Engineers: (120000 + 80000) / 2 = 100000
      avg = described_class.new(country: "United States").job_title_avg_salary("Software Engineer")
      expect(avg).to eq(100_000.0)
    end

    it "returns the average for a different job title" do
      avg = described_class.new(country: "United States").job_title_avg_salary("Product Manager")
      expect(avg).to eq(110_000.0)
    end

    it "returns nil when no employees match the job title in the country" do
      avg = described_class.new(country: "India").job_title_avg_salary("Product Manager")
      expect(avg).to be_nil
    end
  end

  describe "#top_earners" do
    it "returns the top N highest-paid employees in a country" do
      top = described_class.new(country: "United States").top_earners(3)
      expect(top.length).to eq(3)
      expect(top.first.salary).to eq(120_000.0)
      expect(top.last.salary).to eq(80_000.0)
    end

    it "defaults to top 5" do
      top = described_class.new(country: "United States").top_earners
      expect(top.length).to eq(5)
    end

    it "returns fewer than N if not enough employees" do
      top = described_class.new(country: "India").top_earners(10)
      expect(top.length).to eq(3)
    end
  end

  describe "#salary_by_job_title" do
    it "returns average salary grouped by job title for a country" do
      breakdown = described_class.new(country: "United States").salary_by_job_title

      expect(breakdown).to include(
        { job_title: "Software Engineer", avg_salary: 100_000.0, headcount: 2 },
        { job_title: "Product Manager", avg_salary: 110_000.0, headcount: 1 },
        { job_title: "Data Analyst", avg_salary: 70_000.0, headcount: 1 },
        { job_title: "HR Specialist", avg_salary: 60_000.0, headcount: 1 }
      )
    end

    it "only includes job titles from the specified country" do
      breakdown = described_class.new(country: "India").salary_by_job_title
      job_titles = breakdown.map { |row| row[:job_title] }

      expect(job_titles).to contain_exactly("Software Engineer", "Data Analyst")
      expect(job_titles).not_to include("Product Manager", "HR Specialist")
    end
  end

  describe "#employment_type_breakdown" do
    it "returns count and average salary grouped by employment type" do
      breakdown = described_class.new(country: "United States").employment_type_breakdown

      expect(breakdown).to include(
        { employment_type: "full_time", avg_salary: 96_666.67, headcount: 3 },
        { employment_type: "contract", avg_salary: 80_000.0, headcount: 1 },
        { employment_type: "part_time", avg_salary: 70_000.0, headcount: 1 }
      )
    end

    it "only includes types present in the country" do
      breakdown = described_class.new(country: "India").employment_type_breakdown
      types = breakdown.map { |row| row[:employment_type] }

      expect(types).to contain_exactly("full_time", "contract")
    end
  end

  describe "#department_summary" do
    it "returns headcount and average salary grouped by department" do
      summary = described_class.new(country: "United States").department_summary

      expect(summary).to include(
        { department: "Engineering", avg_salary: 100_000.0, headcount: 2 },
        { department: "Product", avg_salary: 110_000.0, headcount: 1 },
        { department: "Data", avg_salary: 70_000.0, headcount: 1 }
      )
    end

    it "excludes employees with no department" do
      summary = described_class.new(country: "United States").department_summary
      departments = summary.map { |row| row[:department] }

      expect(departments).not_to include(nil)
    end
  end
end
