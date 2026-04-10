module Api
  module V1
    class InsightsController < ApplicationController
      # GET /api/v1/insights?country=...&job_title=...
      def index
        unless params[:country].present?
          return render json: { error: "country parameter is required" }, status: :bad_request
        end

        service = SalaryInsightsService.new(country: params[:country])
        insights = service.country_insights

        # Add job title breakdown
        insights[:salary_by_job_title] = service.salary_by_job_title

        # Add top earners (as JSON-friendly hashes)
        insights[:top_earners] = service.top_earners.as_json(except: [:created_at, :updated_at])

        # Add employment type breakdown and department summary
        insights[:employment_type_breakdown] = service.employment_type_breakdown
        insights[:department_summary] = service.department_summary

        # Add job title average if job_title param is provided
        if params[:job_title].present?
          insights[:job_title_avg_salary] = service.job_title_avg_salary(params[:job_title])
        end

        render json: { insights: insights }
      end
    end
  end
end
