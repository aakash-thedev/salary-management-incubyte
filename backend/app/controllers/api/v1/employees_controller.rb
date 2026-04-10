module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: [:show, :update, :destroy]

      # GET /api/v1/employees
      def index
        employees = Employee.all
        employees = employees.where(country: params[:country]) if params[:country].present?
        employees = employees.where("full_name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
        employees = employees.order(created_at: :desc).page(params[:page]).per(25)

        render json: {
          employees: employees.as_json(except: [:created_at, :updated_at]),
          meta: {
            current_page: employees.current_page,
            total_pages: employees.total_pages,
            total_count: employees.total_count
          }
        }
      end

      # GET /api/v1/employees/:id
      def show
        render json: { employee: @employee.as_json }
      end

      # POST /api/v1/employees
      def create
        employee = Employee.new(employee_params)

        if employee.save
          render json: { employee: employee.as_json }, status: :created
        else
          render json: { errors: employee.errors }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/employees/:id
      def update
        if @employee.update(employee_params)
          render json: { employee: @employee.as_json }
        else
          render json: { errors: @employee.errors }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/employees/:id
      def destroy
        @employee.destroy
        head :no_content
      end

      # GET /api/v1/employees/countries
      def countries
        countries = Employee.distinct.pluck(:country).sort
        render json: { countries: countries }
      end

      # GET /api/v1/employees/job_titles
      def job_titles
        job_titles = Employee.distinct.pluck(:job_title).sort
        render json: { job_titles: job_titles }
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Employee not found" }, status: :not_found
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :job_title, :department, :country,
          :salary, :currency, :employment_type, :hired_on
        )
      end
    end
  end
end
