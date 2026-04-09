# frozen_string_literal: true

# ============================================================================
# Seed Script — 10,000 Employees
# ============================================================================
# Usage:     rails db:seed
# Idempotent: Clears existing employees before reseeding.
# Performance: Uses insert_all for bulk inserts (~2-5 seconds for 10K rows).
# ============================================================================

require "benchmark"

EMPLOYEE_COUNT = 10_000
BATCH_SIZE = 2_000

# --- Read name files from project root ---
root = File.expand_path("../../", __dir__)
first_names = File.readlines(File.join(root, "first_names.txt"), chomp: true).reject(&:empty?)
last_names = File.readlines(File.join(root, "last_names.txt"), chomp: true).reject(&:empty?)

puts "Loaded #{first_names.length} first names and #{last_names.length} last names"
puts "Possible unique combinations: #{first_names.length * last_names.length}"

# --- Reference data ---
JOB_TITLES = [
  "Software Engineer", "Senior Software Engineer", "Staff Engineer",
  "Product Manager", "Senior Product Manager",
  "Data Analyst", "Senior Data Analyst", "Data Scientist",
  "HR Specialist", "HR Manager",
  "Sales Manager", "Sales Representative",
  "Finance Analyst", "Finance Manager",
  "DevOps Engineer", "Site Reliability Engineer",
  "UX Designer", "UI Designer",
  "Marketing Manager", "Marketing Specialist",
  "Operations Lead", "Operations Manager",
  "QA Engineer", "Technical Writer",
  "Business Analyst", "Project Manager"
].freeze

DEPARTMENTS = [
  "Engineering", "Product", "Data", "Human Resources",
  "Sales", "Finance", "Operations", "Marketing",
  "Design", "Quality Assurance"
].freeze

# Country with currency and salary range (annual, in local-equivalent USD)
COUNTRIES = {
  "United States"  => { currency: "USD", min: 50_000, max: 200_000 },
  "United Kingdom" => { currency: "GBP", min: 35_000, max: 150_000 },
  "India"          => { currency: "INR", min: 8_000,  max: 80_000  },
  "Germany"        => { currency: "EUR", min: 40_000, max: 160_000 },
  "Canada"         => { currency: "CAD", min: 45_000, max: 170_000 },
  "Australia"      => { currency: "AUD", min: 50_000, max: 180_000 },
  "France"         => { currency: "EUR", min: 35_000, max: 140_000 },
  "Singapore"      => { currency: "SGD", min: 40_000, max: 160_000 },
  "Netherlands"    => { currency: "EUR", min: 38_000, max: 150_000 },
  "Brazil"         => { currency: "BRL", min: 10_000, max: 90_000  },
  "Japan"          => { currency: "JPY", min: 30_000, max: 140_000 },
  "South Korea"    => { currency: "KRW", min: 25_000, max: 120_000 }
}.freeze

EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze
EMPLOYMENT_TYPE_WEIGHTS = [0.75, 0.15, 0.10].freeze

# --- Helper: weighted random selection ---
def weighted_sample(items, weights)
  roll = rand
  cumulative = 0.0
  items.each_with_index do |item, i|
    cumulative += weights[i]
    return item if roll <= cumulative
  end
  items.last
end

# --- Helper: realistic salary with some variance ---
def random_salary(min, max)
  salary = rand(min..max)
  (salary / 500.0).round * 500 # Round to nearest 500 for realism
end

# --- Helper: random hire date within the last 10 years ---
def random_hire_date
  Date.today - rand(1..3650)
end

# --- Clear existing data (idempotent) ---
puts "\nClearing existing employees..."
Employee.delete_all

# --- Build and insert in batches ---
puts "Generating #{EMPLOYEE_COUNT} employees..."

total_time = Benchmark.measure do
  now = Time.current
  inserted = 0

  EMPLOYEE_COUNT.times.each_slice(BATCH_SIZE) do |batch|
    records = batch.map do
      country_name = COUNTRIES.keys.sample
      country_data = COUNTRIES[country_name]

      {
        full_name:       "#{first_names.sample} #{last_names.sample}",
        job_title:       JOB_TITLES.sample,
        department:      DEPARTMENTS.sample,
        country:         country_name,
        salary:          random_salary(country_data[:min], country_data[:max]),
        currency:        country_data[:currency],
        employment_type: weighted_sample(EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_WEIGHTS),
        hired_on:        random_hire_date,
        created_at:      now,
        updated_at:      now
      }
    end

    Employee.insert_all(records)
    inserted += records.size
    puts "  Inserted #{inserted}/#{EMPLOYEE_COUNT} employees..."
  end
end

# --- Summary ---
puts "\n#{'=' * 60}"
puts "Seeding complete!"
puts "  Total employees: #{Employee.count}"
puts "  Countries:       #{Employee.distinct.count(:country)}"
puts "  Job titles:      #{Employee.distinct.count(:job_title)}"
puts "  Time taken:      #{total_time.real.round(2)} seconds"
puts "#{'=' * 60}"
