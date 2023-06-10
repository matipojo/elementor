const defaultMessages = [
	{
		role: 'user',
		content: `
			you are a generative AI of XMLs based on prompts.
			the allowed tags are row, column, image, title, text, button, divider.
			the allowed attributes are color, bgColor, bgImage, bgGradient, height, width, padding, margin, gap, alignItems, justifyContent, border, borderRadius, font, fontSize, fontWeight, align, fullWidth, boxed.
			image tags and bgImage attributes don't have URLs of images but descriptions of them.
			based on this XML guidelines, create a section about fitness and training.
			create 2 columns. the left one should have subtitle, title, text and button. the right one should only have a background image.
			use red, yellow, white and black color scheme`,
	},
	{
		role: 'assistant',
		content: `
			<row height="100vh" gap="0" padding="0" alignItems="stretch" fullWidth="true" bgGradient="linear-gradient(45deg, #467FF7, #FFFFFF)">
				<column justifyContent="center" fullWidth="true" gap="20px" bgColor="#FE114B" padding="0" margin="0">
					<title align="center" color="#F8F812" font="Montserrat" fontSize="22px" fontWeight="600">Believe in Yourself</title>
					<title align="center" color="#FBFBFB" font="Archivo" fontSize="115px" fontWeight="900">BE THE BEST YOU CAN BE</title>
					<text align="center" color="#FFFFFF" font="Montserrat" fontSize="26px" fontWeight="300" padding="0 8%">
						Initial one-to-one consultation, Health &amp; Fitness Assesments Bespoke training program planing, Custom Nutrition plan &amp; recipes. Weekly Progress Reviews
					</text>
					<button href="/pricing" align="center" color="#1B252F" hover_color="#F8F812" bgColor="#F8F812" hover_bgColor="#1B252F" font="Archivo" fontSize="18px" fontWeight="800" padding="20px 55px">
						SEE PRICING &gt;
					</button>
				</column>
				<column fullWidth="true" bgImage="a female fitness trainer looking at the camera with boxing equipment"></column>
			</row>
		`,
	},
	{
		role: 'user',
		content: `now, based on this knowledge, create a section for digital agency company with subtle pink gradient background, with some text and 4 images of people`,
	},
	{
		role: 'assistant',
		content: `
			<row boxed="true" width="1400px" height="80vh" bgGradient="linear-gradient(40deg, #F8C3D0 10%, #FFF 30%)" padding="5%">
				<column fullWidth="true" width="100%" justifyContent="center" gap="30px" padding="0">
					<divider width="105px" color="#212121"></divider>
					<title color="#212121" font="Poppins" fontWeight="500" fontSize="60px">An award-winning full-stack digital marketing studio</title>
					<text color="#212121" font="Poppins" fontWeight="300" fontSize="20px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius massa at urna pretium convallis. Sed sed ullamcorper ligula. Praesent sagittis nisi eu eros consequat luctus. Proin a mollis ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam enim elit, hendrerit eu metus ut, porttitor dictum purus. Praesent sit amet purus turpis. </text>
				</column>
				<row fullWidth="true" width="100%" justifyContent="end" gap="20px" padding="0" wrap="true">
					<image width="40%">studio portrait of black woman drinking coffee</image>
					<image width="40%">studio portrait of serious blonde white woman profile</image>
					<image width="40%">studio portrait of a person with a funny haircut, glasses, office, medium shot</image>
					<image width="40%">studio portrait of asian with pink background, happy</image>
				</row>
			</row>`,
	},
	{
		role: 'user',
		content: `create a "meet our team" block with high-end layout design, with alternating images positions`,
	},
	{
		role: 'assistant',
		content: `
			<column boxed="true" width="100%" gap="65px" bgColor="#F7F7F7" padding="4% 8%">
				<column boxed="true" width="1140px" gap="10px" padding="0">
					<title align="center" color="#5E0EE6" font="DM Sans" fontWeight="400" fontSize="16px">MEET THE TEAM</title>
					<title align="center" color="#5E0EE6" font="DM Sans" fontWeight="500" fontSize="2.5vw">Powered by our people</title>
				</column>
				<row boxed="true" width="1584px" height="450px" gap="0" padding="0">
					<image width="25%" margin="0 -10% 0 0">studio portrait of black woman drinking coffee, light orange background</image>
					<image width="25%" margin="120px -40px 0 0">studio portrait of serious blonde white woman</image>
					<image width="32%" margin="28px 0 23px 0" zIndex="5">studio portrait of a fashion black man with black hat grayish blueish background</image>
					<image width="25%" margin="120px 0 0 -40px">studio portrait of generic black woman with greenish background</image>
					<image width="25%" margin="0 0 0 -40px">studio portrait of asian with light pink background, happy, glam</image>
				</row>
			</column>`,
	},
	{
		role: 'user',
		content: `create a cool about section for graphic design agency, with cool layout and modern design`,
	},
	{
		role: 'assistant',
		content: `
			<column boxed="true" width="100%" gap="50px" bgColor="#F6F7FB" padding="4% 8%">
				<column boxed="true" width="100%" gap="30px" padding="0">
					<divider width="60px" color="#5E5E5E"></divider>
					<title align="center" color="#5E5E5E" font="Montserrat" fontWeight="600" fontSize="18px">ABOUT US</title>
					<title align="center" color="#252525" font="Poppins" fontWeight="900" fontSize="3.5vw">CREATIVE IS OUR CORE</title>
					<text align="center" color="#8D8D8D" font="Poppins" fontWeight="400" fontSize="18px" padding="0 10%">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</text>
				</column>
				<row boxed="true" width="1050px" justifyContent="space-between" gap="5%">
						<column width="45%">
								<image width="100%">Creative graphic designer brainstorming ideas at office desk</image>
							</column>
							<column width="45%">
									<column boxed="true" width="100%" gap="30px" padding="0">
										<divider width="90px" color="#5E5E5E"></divider>
										<title color="#5C5B5B" font="Poppins" fontWeight="700" fontSize="22px">The best of your ideas combined with our creativity</title>
										<text color="#8D8D8D" font="Poppins" fontWeight="400" fontSize="18px" padding="20px 0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</text>
										<button href="/services" color="#fff" bgColor="#5E5E5E" font="Poppins" fontWeight="700" fontSize="14px" padding="14px 35px">See our services</button>
									</column>
						</column>
				</row>
			</column>`,
	},
];

export default defaultMessages;
