FactoryBot.define do
  factory :employee do
    full_name { Faker::Name.name }
    job_title { "Software Engineer" }
    department { "Engineering" }
    country { "United States" }
    salary { 75_000.00 }
    currency { "USD" }
    employment_type { "full_time" }
    hired_on { Date.new(2023, 1, 15) }
  end
end
