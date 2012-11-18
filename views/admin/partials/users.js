h4 Users
			#usersList
				-var rates = 0;
				each user, i in users
					h3(style="line-height: 50px;") 
						img(src="#{user.image.thumb}", width="50", height="50", style="vertical-align:middle; margin: 0 10px 0 0") 
						span #{user.name.first} #{user.name.last}
					div
						
			input(type="button", value="new user")