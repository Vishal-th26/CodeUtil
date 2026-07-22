import java.util.ArrayList;
import java.util.List;

interface Payable {
    double calculateSalary();
}

class Employee implements Payable {
    private String name;
    private double salary;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    @Override
    public double calculateSalary() {
        return salary;
    }

    public void displayInfo() {
        System.out.println("Employee: " + name);
        System.out.println("Salary: " + salary);
    }
}

class Manager extends Employee {

    private double bonus;

    public Manager(String name, double salary, double bonus) {
        super(name, salary);
        this.bonus = bonus;
    }

    @Override
    public double calculateSalary() {
        return super.calculateSalary() + bonus;
    }

    public double getBonus() {
        return bonus;
    }
}

class Payroll {

    public static double calculateTotalPayroll(List<Employee> employees) {

        double total = 0;

        for (Employee employee : employees) {
            total += employee.calculateSalary();
        }

        return total;
    }

    public static Employee findHighestPaid(List<Employee> employees) {

        Employee highest = employees.get(0);

        for (Employee employee : employees) {
            if (employee.calculateSalary() > highest.calculateSalary()) {
                highest = employee;
            }
        }

        return highest;
    }
}

public class CompanyManagement {

    public static void main(String[] args) {

        List<Employee> employees = new ArrayList<>();

        employees.add(new Employee("Alice", 50000));
        employees.add(new Employee("Bob", 60000));
        employees.add(new Manager("Charlie", 80000, 20000));

        for (Employee employee : employees) {
            employee.displayInfo();
            System.out.println("Total Salary: " + employee.calculateSalary());
            System.out.println("----------------------");
        }

        double totalPayroll = Payroll.calculateTotalPayroll(employees);

        Employee highest = Payroll.findHighestPaid(employees);

        System.out.println("Company Payroll: " + totalPayroll);
        System.out.println("Highest Paid Employee: " + highest.getName());
    }
}