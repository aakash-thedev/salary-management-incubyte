class SalaryInsightsService
  def initialize(country:)
    @country = country
    @scope = Employee.where(country: country)
  end

  # Returns min, max, average, median salary and headcount for the country
  def country_insights
    stats = @scope.pick(
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("COUNT(*)")
    )

    min_salary, max_salary, avg_salary, headcount = stats

    {
      min_salary: min_salary&.to_f,
      max_salary: max_salary&.to_f,
      avg_salary: avg_salary&.to_f&.round(2),
      median_salary: compute_median,
      headcount: headcount
    }
  end

  # Returns the average salary for a specific job title in the country
  def job_title_avg_salary(job_title)
    result = @scope.where(job_title: job_title).average(:salary)
    result&.to_f
  end

  # Returns the top N highest-paid employees in the country
  def top_earners(limit = 5)
    @scope.order(salary: :desc).limit(limit)
  end

  # Returns average salary and headcount grouped by job title
  def salary_by_job_title
    @scope
      .group(:job_title)
      .pluck(
        Arel.sql("job_title"),
        Arel.sql("AVG(salary)"),
        Arel.sql("COUNT(*)")
      )
      .map do |job_title, avg_salary, headcount|
        {
          job_title: job_title,
          avg_salary: avg_salary.to_f.round(2),
          headcount: headcount
        }
      end
  end

  private

  # Compute median salary using SQL PERCENTILE_CONT (PostgreSQL)
  def compute_median
    result = @scope.pick(
      Arel.sql("PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)")
    )
    result&.to_f
  end
end
