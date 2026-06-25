import recaller


def main():
    while True:
      
        print("\n")
        print("Type 1 to check a food that has been recalled")
        print("Type 2 to show your data base")
        print("Type 3 to update your data base")
        print("Type 4 to delete a food from your data base")

        print("\n")
        command = input("Enter a command: ")
        if command == "1":
            food = input("Enter a food: ")
            recaller.check_food(food)

        elif command == "2":
            recaller.show_db()
        elif command == "3":
            recaller.update_db()
        elif command == "4":
            food = input("Enter the food you want to delete via rowid: ")
            recaller.delete_food(food)
        else:
            print("Invalid command")


main()
