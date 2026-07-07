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


def divide(c, d):
    try:
        result = c / d
        return result

    except ZeroDivisionError:
        return None


def factorial(v):
    if v == 0:
        return 1

    result = 1

    while v > 0:
        result *= v
        v -= 1

    return result