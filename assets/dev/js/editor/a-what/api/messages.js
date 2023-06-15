const defaultMessages = [
	{
		role: 'user',
		content: `
			you are a generative AI of XMLs based on prompts.
			the allowed tags are row, column, img, title, text, button, divider, icon.
			the allowed attributes are color, bgColor, bgImageAlt, bgGradient, height, width, padding, margin, gap, alignItems, justifyContent, border, borderRadius, font, fontSize, fontWeight, align, fullWidth, boxed.
			alt and bgImageAlt attributes are NOT URLs, they should be concise, descriptive, and provide relevant information about the image content. describe them with the words "instagram style".
			colors will be #000 #fff and variables only, the variables will be: var( --background-color ), var( --primary-color ), var( --secondary-color ), var( --text-color ), var( --accent-color ).
			NEVER give explanation about the prompt result, just give the result as clean XML.
			based on this XML guidelines, Create a full-height row with a background image of an office. Inside, create a
			column with a dark semi-transparent background, titles, and a row with multiple columns. Each column contains
			an image, a title, and a text description related to a specific service: Search Engine Optimization, Social
			Media Marketing, and Web Design and Development.`,
	},
	{
		role: 'assistant',
		content: `
			<column boxed="true" width="100%" gap="50px" bgColor="var( --background-color )" padding="4% 8%" alignItems="center">
				<title align="center" color="var( --primary-color )" font="Montserrat" fontWeight="600" fontSize="40px">OUR SERVICES</title>
				<row boxed="true" width="100%" justifyContent="center" gap="50px" padding="0">
					<column boxed="true" width="350px" gap="20px" padding="30px" bgColor="#FFFFFF" borderRadius="20px" alignItems="center" justifyContent="space-between">
						<img align="center" width="70px" alt="icon for SEO optimization" />
						<title align="center" color="var( --primary-color )" font="Poppins" fontWeight="700" fontSize="22px">Search Engine Optimization</title>
						<text color="var( --text-color )" font="Poppins" fontWeight="400" fontSize="16px" align="center">Our SEO experts work on strategies that help your website rank higher on Google and other search engines, increasing organic traffic to your website. </text>
						<button href="/seo" color="#FFFFFF" bgColor="var( --secondary-color )" font="Poppins" fontWeight="700" fontSize="14px" padding="14px 35px">Read More</button>
					</column>
					<column boxed="true" width="350px" gap="20px" padding="30px" bgColor="var( --accent-color )" borderRadius="20px" alignItems="center" justifyContent="space-between">
						<img align="center" width="70px" alt="icon for social media marketing" />
						<title align="center" color="var( --primary-color )" font="Poppins" fontWeight="700" fontSize="22px">Social Media Marketing</title>
						<text color="var( --text-color )" font="Poppins" fontWeight="400" fontSize="16px" align="center">We run targeted ad campaigns on social media platforms that help you reach your target audience, increase brand awareness, and drive more traffic to your website or store.</text>
						<button href="/social-media" color="#FFFFFF" bgColor="var( --secondary-color )" font="Poppins" fontWeight="700" fontSize="14px" padding="14px 35px">Read More</button>
					</column>
					<column boxed="true" width="350px" gap="20px" padding="30px" bgColor="#FFFFFF" borderRadius="20px" alignItems="center" justifyContent="space-between">
						<img align="center" width="70px" alt="icon for web design" />
						<title align="center" color="var( --primary-color )" font="Poppins" fontWeight="700" fontSize="22px">Web Design and Development</title>
						<text color="var( --text-color )" font="Poppins" fontWeight="400" fontSize="16px" align="center">Our web design and development team creates visually stunning and user-friendly websites that help you convert more visitors into customers and grow your business online.</text>
						<button href="/web-design" color="#FFFFFF" bgColor="var( --secondary-color )" font="Poppins" fontWeight="700" fontSize="14px" padding="14px 35px">Read More</button>
					</column>
				</row>
			</column>`
		,
	},
	{
		role: 'user',
		content: `Create an about section as boxed row with a width of 1400px and a height of 80% of the viewport.
			The row has a background gradient, fading from primary color to white. Inside the row, place a centered column with
			a divider, a title, and a text paragraph. Next, create another row that spans the full width and has images
			aligned to the right with some spacing. The images depict studio portraits of different individuals.`,
	},
	{
		role: 'assistant',
		content: `
			<row boxed="true" width="1400px" height="80vh" bgGradient="linear-gradient(40deg, var( --primary-color ) 10%, #FFF 30%)" padding="5%">
				<column fullWidth="true" width="100%" justifyContent="center" gap="30px" padding="0">
					<divider width="105px" color="var( --divider-color )"></divider>
					<title color="var( --primary-color )" font="Poppins" fontWeight="500" fontSize="60px">An award-winning full-stack digital marketing studio</title>
					<text color="var( --text-color )" font="Poppins" fontWeight="300" fontSize="20px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius massa at urna pretium convallis. Sed sed ullamcorper ligula. Praesent sagittis nisi eu eros consequat luctus. Proin a mollis ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam enim elit, hendrerit eu metus ut, porttitor dictum purus. Praesent sit amet purus turpis. </text>
				</column>
				<row fullWidth="true" width="100%" justifyContent="end" gap="20px" padding="0" wrap="true">
					<img width="40%" alt="studio portrait of black woman drinking coffee" />
					<img width="40%" alt="studio portrait of serious blonde white woman profile" />
					<img width="40%" alt="studio portrait of a person with a funny haircut, glasses, office, medium shot" />
					<img width="40%" alt="studio portrait of asian with pink background, happy" />
				</row>
			</row>`,
	},
	{
		role: 'user',
		content: `Create a boxed column that spans the full width and has a color background.
		Inside this column, add another boxed column with a width of 1140px and some spacing.
		Include two titles aligned to the center, one in purple and the other in a responsive font size. Below the titles,
		create a boxed row with a width of 1584px and a height of 450px. Within this row, place multiple images of individuals
		with different backgrounds and styles, including a black woman drinking coffee, a serious blonde white woman, a
		fashionable black man, a generic black woman, and an Asian person with a light pink background.`,
	},
	{
		role: 'assistant',
		content: `
			<column boxed="true" width="100%" gap="65px" bgColor="var( --background-color )" padding="4% 8%">
				<column boxed="true" width="1140px" gap="10px" padding="0">
					<title align="center" color="var( --secondary-color )" font="DM Sans" fontWeight="400" fontSize="16px">MEET THE TEAM</title>
					<title align="center" color="var( --secondary-color )" font="DM Sans" fontWeight="500" fontSize="2.5vw">Powered by our people</title>
				</column>
				<row boxed="true" width="1584px" height="450px" gap="0" padding="0">
					<img width="25%" margin="0 -10% 0 0" alt="studio portrait of black woman drinking coffee, light orange background" />
					<img width="25%" margin="120px -40px 0 0" alt="studio portrait of serious blonde white woman" />
					<img width="32%" margin="28px 0 23px 0" zIndex="5" alt="studio portrait of a fashion black man with black hat grayish blueish background" />
					<img width="25%" margin="120px 0 0 -40px" alt="studio portrait of generic black woman with greenish background" />
					<img width="25%" margin="0 0 0 -40px" alt="studio portrait of asian with light pink background, happy, glam" />
				</row>
			</column>`,
	},
	{
		role: 'user',
		content: `Create an about us section as boxed column with a accent background, padding, and a gap between elements. Inside, add a
		divider, titles, and a text paragraph. Below, create a boxed row with two columns. The first column contains an
		image, while the second column has a divider, a title, a text paragraph, and a button.`,
	},
	{
		role: 'assistant',
		content: `
			<column boxed="true" width="100%" gap="50px" bgColor="var( --accent-color )" padding="4% 8%">
				<column boxed="true" width="100%" gap="30px" padding="0">
					<divider align="center" width="60px" color="var( --divider-color )"></divider>
					<title align="center" color="var( --primary-color )" font="Montserrat" fontWeight="600" fontSize="18px">ABOUT US</title>
					<title align="center" color="var( --secondary-color )" font="Poppins" fontWeight="900" fontSize="3.5vw">CREATIVE IS OUR CORE</title>
					<text align="center" color="var( --text-color )" font="Poppins" fontWeight="400" fontSize="18px" padding="0 10%">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</text>
				</column>
				<row boxed="true" width="1050px" justifyContent="center" gap="5%">
					<column width="50%">
							<img width="100%" alt="Creative graphic designer brainstorming ideas at office desk" />
							<button align="center" width="150px" height="50px" bgColor="#fff" color="var( --secondary-color )" font="Poppins" fontWeight="500" fontSize="16px">LEARN MORE</button>
					</column>
				</row>
			</column>`,
	},
	// {
	// 	role: 'user',
	// 	content: `Create a boxed row with a width of 1400px and a height of 80% of the viewport.
	// 		The row has a background gradient, fading from pink to white. Inside the row, place a centered column with a title,
	// 		and a heart pink icon of size 200px.`,
	// },
	// {
	// 	role: 'assistant',
	// 	content: `
	// 		<row boxed="true" width="1400px" height="80vh" bgGradient="linear-gradient(40deg, var( --primary-color ) 10%, var( --primary_darker-color ) 30%)" padding="5%">
	// 			<column fullWidth="true" width="100%" justifyContent="center" gap="30px" padding="0">
	// 				<title color="#fff" font="Poppins" fontWeight="500" fontSize="60px">An award-winning full-stack digital marketing studio</title>
	// 				<text color="var( --text-color )" font="Poppins" fontWeight="300" fontSize="20px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius massa at urna pretium convallis. Sed sed ullamcorper ligula. Praesent sagittis nisi eu eros consequat luctus. Proin a mollis ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam enim elit, hendrerit eu metus ut, porttitor dictum purus. Praesent sit amet purus turpis. </text>
	// 			</column>
	// 			<row fullWidth="true" width="100%" justifyContent="end" gap="20px" padding="0" wrap="true">
	// 				<icon color="var( --primary-color )" fontSize="200px" value="fas fa-heart"></icon>
	// 			</row>
	// 		</row>`,
	// },
];

export default defaultMessages;
