## Inspiration
This project is inspired by our personal experiences of seeing elderly relatives struggle with keeping track of their prescriptions as well as with the complexity of modern tech. By creating simple, no-signup-required, and user-friendly apps, we aim to enhance their quality of life and improve their health as well.

## What it does
Althea allows users to enter which prescriptions drugs they are taking so that they can have a checklist to remember what they have taken on a certain day. Althea then asks the user if they felt any symptoms the same day and notifies the user if the symptoms, they had could be side effects of a drug they use. The user can rate the severity of the symptoms they felt. Finally, users would be able to see past logs and even export them as PDFs if they would like to share the information easily with their primary care providers.

## How we built it
For the front-end, we used JavaScript with Tailwind CSS and HTML for a smooth and sleek user experience. For the back-end, we used Python with Django. We organized schemas and used SQLite for patient data because of its sensitive nature. We used PostgreSQL for medicine data since we wanted it to be shared among different people and used Gemini AI in conjunction with it. For the mobile app alternative, we used pure Flutter and emulated on our machine.

## Challenges we ran into
One significant challenge we ran into early on was deciding with what tech to build our app. We originally agreed on React Native since we all were familiar with React, but we learned that they're not that similar. This caused us to lose quite some time as we struggle with figuring it out. After that, we decided to do React+Django web app with a Flutter mobile app in parallel with huge ambition to interconnect them. However, time constraints and technical challenges didn't allow us to achieve our initial goals.
Additionally, our web team was challenged by the undertaking of linking the frontend and backend via API endpoints.

## Accomplishments that we're proud of
We're proud of few things. First, we have a large codebase with well-maintained structure, tech and features. Second, we have a neat, streamlined and user-friendly navigation system for both the web and mobile app. Third, we did a decent design considering we are all primarily backend developers with minor experience in React or any other frontend tech. Lastly, we worked on two projects in parallel, even though linking them together didn't work out.

## What we learned
Teamwork and communication are a must. Hackathons are the grindiest grind out there (lol). Gradual development and constant updates via Git is the path to success. We made sure to work on separate branches and then merge them to avoid conflicts as well as having structured file system that promotes collaboration. And lastly, simplicity is a key, trying to hard or aiming to high often won't end good.

## What's next for Althea
Next thing is implementing all the features that stayed on the whiteboard as well as connecting web and mobile apps into one ecosystem, allowing seamless access for wide audience. Definitely making our UI/UX even better but also streamlined and simple so any user, even least tech-wise, can use it. A cool and useful feature would be allowing users to securely scan their prescription label with their phone camera.
