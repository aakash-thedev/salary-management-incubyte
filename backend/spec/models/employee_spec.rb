require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe "validations" do
    context "with valid attributes" do
      it "is valid with all required fields" do
        employee = build(:employee)
        expect(employee).to be_valid
      end

      it "is valid without optional fields (department, hired_on)" do
        employee = build(:employee, department: nil, hired_on: nil)
        expect(employee).to be_valid
      end
    end

    context "with missing required fields" do
      it "is invalid without a full_name" do
        employee = build(:employee, full_name: nil)
        expect(employee).not_to be_valid
        expect(employee.errors[:full_name]).to include("can't be blank")
      end

      it "is invalid without a job_title" do
        employee = build(:employee, job_title: nil)
        expect(employee).not_to be_valid
        expect(employee.errors[:job_title]).to include("can't be blank")
      end

      it "is invalid without a country" do
        employee = build(:employee, country: nil)
        expect(employee).not_to be_valid
        expect(employee.errors[:country]).to include("can't be blank")
      end

      it "is invalid without a salary" do
        employee = build(:employee, salary: nil)
        expect(employee).not_to be_valid
        expect(employee.errors[:salary]).to include("can't be blank")
      end
    end

    context "with invalid salary values" do
      it "is invalid with a negative salary" do
        employee = build(:employee, salary: -1000)
        expect(employee).not_to be_valid
        expect(employee.errors[:salary]).to include("must be greater than 0")
      end

      it "is invalid with a zero salary" do
        employee = build(:employee, salary: 0)
        expect(employee).not_to be_valid
        expect(employee.errors[:salary]).to include("must be greater than 0")
      end

      it "is invalid with a non-numeric salary" do
        employee = build(:employee, salary: "not_a_number")
        expect(employee).not_to be_valid
        expect(employee.errors[:salary]).to include("is not a number")
      end
    end

    context "with invalid employment_type" do
      it "is invalid with an unrecognized employment type" do
        employee = build(:employee, employment_type: "intern")
        expect(employee).not_to be_valid
        expect(employee.errors[:employment_type]).to include("is not included in the list")
      end
    end
  end
end
