import math
import random
from datetime import datetime


PI = 3.14159


def greet(name):
    print(f"Hello, {name}")


def calculate_area(radius):
    area = PI * radius ** 2
    return area


def find_even_numbers(numbers):
    evens = []

    for num in numbers:
        if num % 2 == 0:
            evens.append(num)

    return evens


def divide(a, b):
    try:
        result = a / b
        return result

    except ZeroDivisionError:
        return None


def factorial(n):
    if n == 0:
        return 1

    result = 1

    while n > 0:
        result *= n
        n -= 1

    return result

def decorator(func):
    def wrapper(*args, **kwargs):
        print("Function started")
        value = func(*args, **kwargs)
        print("Function finished")
        return value

    return wrapper


@decorator
def add(a, b):
    return a + b


class BankAccount:

    interest_rate = 0.05

    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
        else:
            print("Insufficient funds")

    @classmethod
    def get_interest_rate(cls):
        return cls.interest_rate

    @staticmethod
    def bank_name():
        return "CodeUtil Bank"


class Student:

    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def average(self):
        return sum(self.marks) / len(self.marks)

    def grade(self):
        avg = self.average()

        if avg >= 90:
            return "A"

        elif avg >= 75:
            return "B"

        elif avg >= 60:
            return "C"

        else:
            return "D"


numbers = [1, 2, 3, 4, 5, 6]

evens = find_even_numbers(numbers)

for n in evens:
    print(n)


account = BankAccount("Tony", 1000)
account.deposit(500)
account.withdraw(300)

student = Student("Peter", [80, 90, 95])
print(student.grade())

print(calculate_area(5))
print(divide(10, 2))
print(add(3, 4))

current_time = datetime.now()
print(current_time)

