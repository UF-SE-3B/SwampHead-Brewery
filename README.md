# SwampHead-Brewery

http://swamp-head-menu.herokuapp.com

This UF project used ng-animate, angular-toastr, ng-dragdrop in addition with Bootstrap and the base MEAN.js application.

#How to run the project locally:

1. Open project directory (whereever you forked in cloned it on your machine) in Git Bash.
2. In the terminal, type "grunt" and press enter.
3. Open "localhost:3000" in your browser of choice.
4. Refresh the page if necessary.

#How to update database and server connections:

1. To change the mongo db uri for development, go to config/env/development.js and change the link
2. To change the mongo db uri for deployment, go to heroku.
	click on the swamp-head-menu app
	click settings and change the config variable (reveal config variable button)
	paste new link

# Functionality & Screenshots
1. Visiters can view a dynamically changing menu.
2. Bartenders can log in and toggle currently available/unavailable drinks and reorganize their menu location via drag-n-drop.
3. Managers can add, edit and delete drinks in the database, along with the above.
4. Admins can edit and delete users in the system, along with the above.
![Alt text](/dep-screenshots/landing-pg.jpg?raw=true "Landing Page")
![Alt text](/dep-screenshots/sign-in.jpg?raw=true "Sign In")
![Alt text](/dep-screenshots/list-drinks-pg.jpg?raw=true "List Drinks 1")
![Alt text](/dep-screenshots/list-drinks-pg2.jpg?raw=true "List Drinks 2")
![Alt text](/dep-screenshots/edit-drinks-pg.jpg?raw=true "Edit Drinks")
![Alt text](/dep-screenshots/list-users-pg.jpg?raw=true "List Users")
![Alt text](/dep-screenshots/edit-users-pg.jpg?raw=true "Edit Users")
![Alt text](/dep-screenshots/menu-pg.jpg?raw=true "Menu")
