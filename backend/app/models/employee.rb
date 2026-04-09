class Employee < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze

  validates :full_name, presence: true
  validates :job_title, presence: true
  validates :country, presence: true
  validates :salary, presence: true, numericality: { greater_than: 0 }
  validates :employment_type, inclusion: { in: EMPLOYMENT_TYPES }
end
