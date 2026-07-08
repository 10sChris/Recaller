import recaller


def main():
    while True:

        print("\n")
        print("Type 1 to check a food that has been recalled")
        print("Type 2 to show your data base")
        print("Type 3 to delete a food from your data base")

        print("\n")
        command = input("Enter a command: ")
        if command == "1":
            food = input("Enter a food: ")
            searched_food = recaller.search_food(food)
            recaller.select_food(searched_food, summarize=False)

        elif command == "2":
            recaller.show_db()
        elif command == "3":
            food = input("Enter the food you want to delete via row id: ")
            recaller.delete_food(food)
        else:
            print("Invalid command")


main()
