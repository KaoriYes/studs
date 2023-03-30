# Theme-builder
<img src="https://user-images.githubusercontent.com/118130116/225438212-b6eac2b4-16c0-4ee1-98cf-4dbe9eeb072c.jpg" alt="Hexside Banner">

# <img src="https://user-images.githubusercontent.com/118130116/225440139-765ae9a9-fe11-476f-a4a5-86a7f6f9c85c.png" alt="Bulb" width="3%"> Het idee  

De theme-builder webapplicatie is een tool voor de beheerders van de Hexside school website. Met deze applicatie kunnen zij gemakkelijk thema's maken die de verschillende opleidingen op de website representeren. Met behulp van de tool kunnen zij een thema ontwerpen door het logo van de opleiding, kleurenschema's en lettertypen te selecteren. Op deze manier kunnen ze snel en gemakkelijk nieuwe thema's maken die passen bij de visuele identiteit van de verschillende opleidingen op de school. Dit bespaart tijd en maakt het gemakkelijk om de website up-to-date te houden met visuele elementen die de juiste informatie weergeven.

# <img src="https://user-images.githubusercontent.com/118130116/225445163-90c73524-57ac-4ec6-92a4-59f04a13cf9c.png" alt="Bulb" width="4%"> De Feature
Een interessante feature van de theme-builder webapplicatie is de mogelijkheid om eenvoudig en snel een thema aan te passen aan de huisstijl van een specifieke opleiding. Met behulp van een gebruiksvriendelijke interface kunnen admins het logo van de opleiding uploaden, de kleuren en het font aanpassen, en zo het uiterlijk van de website aanpassen aan de specifieke opleiding. Dit biedt niet alleen een gepersonaliseerde ervaring voor bezoekers van de website, maar verhoogt ook de betrokkenheid van de opleidingen bij de website en de school als geheel.

• Je vult het formulier in <br>
• Je kiest een kleur die de opleiding representeert <br>
• Je upload het embleem van de opleiding. <br>

Eenmaal ingevuld, genereert de pagina naar de stijl die je hebt doorgevoerd. Deze wordt vervolgens op geslagen in de database. 

# <img src="https://user-images.githubusercontent.com/118130116/225447242-929f96b9-b97c-44f0-961a-d568b64222ae.png" alt="Boek" width="4%"> Gebruiksaanwijzing 

Om de theme-builder applicatie te gebruiken moet je lid zijn van de IT afdeling van de school... Nee grapje, maar hier doen we even alsof je al ingelogd bent en aan de slag gaat. Vervolgens kan je een nieuwe thema maken door de gewenste opleiding te selecteren, een logo te uploaden, de gewenste kleuren en lettertypen te kiezen en eventuele andere aanpassingen te maken.

Zodra het thema is aangemaakt en opgeslagen, kunnen gebruikers het toepassen op de website van de betreffende opleiding. De thema's zijn direct beschikbaar voor de websitebezoekers. Het gebruik van de theme-builder applicatie vereist dus geen technische kennis en is gemakkelijk te gebruiken.
Voordat je de Theme Builder applicatie installeert, zorg ervoor dat je de volgende software hebt geïnstalleerd:
<br>
<br>
<br>
<img src="https://user-images.githubusercontent.com/118130116/225453128-9231666c-c840-4c38-96f1-a5222809bbbe.png" alt="node.js" width="4%">
<br>
Typ eerst `git install` in je terminal.
<br>Typ `git --version` om te controleren of Git correct is geïnstalleerd.<br>
<pre><code>git install</code></pre>
<br>
<img src="https://user-images.githubusercontent.com/118130116/225452827-8e4ece15-8832-496f-80a7-d3a9110b79c3.png" alt="node.js" width="10%">
Typ eerst `node install` in je terminal.
<br>Typ `node --version` om te controleren of Node.js correct is geïnstalleerd.
<br>Je zult het type en de versie van Node.js ontvangen, bijvoorbeeld: "v18.8.0".<br><br>

<pre><code>node install</code></pre>


<br><img src="https://user-images.githubusercontent.com/118130116/225454409-7fce49f3-5060-4a24-b758-ab6d85184455.png" alt="node.js" width="13%">

Voordat je de Theme Builder applicatie kunt gebruiken, moet je een database aanmaken met meerdere verzamelingen. Ik gebruik MongoDB om de gegevens voor deze applicatie op te slaan. Volg de onderstaande stappen, je kunt ook deze tutorial volgen:<br>

• Maak een `cluster` aan, ik zou aanraden om de naam `"cluster0"` te gebruiken.
<br>• Maak een database aan, kies je eigen naam.
Maak vervolgens de eerste verzameling genaamd `"themes"`. <br>In deze verzameling slaan we de informatie op over de thema's die we in onze applicatie renderen.
<br><br>• env.
Zodra je de databases hebt aangemaakt, moet je een `.env-bestand` maken in de root van de map waarin je werkt voor deze applicatie.<br><br>
 Dit .env-bestand moet één variabele bevatten.
<br>
<pre><code>MONGO_PASSWORD=yourpassword</code></pre>
<br>
<img src="https://user-images.githubusercontent.com/118130116/225457713-fb534da2-d62f-420e-aaec-169b6da25364.png" alt="Theme-builder installeren" width="40%">
Kloon de originele repository van de theme-builder naar je lokale apparaat. Het is belangrijk dat je dit wel op een computer of laptop gebruikt.
<br>
<br>
<pre><code>git clone https://github.com/AliAhmed205/Tech-22-23</code></pre>

Wanneer je deze repository hebt gekloond, een kopie van de database hebt gemaakt en het .env-bestand hebt toegevoegd, zorg er dan voor dat je de volgende stappen volgt:

<img src="https://user-images.githubusercontent.com/118130116/225458593-b666cbec-78a3-4849-ba25-62ab159680cc.png" alt="NPM" width="6%">
Typ eerst `npm install` in je terminal.
<br>Typ `npm --version` om te controleren of Node.js correct is geïnstalleerd.
Typ `npm start` in de terminal om de Node.js-server te starten, waarmee de Theme Builder-applicatie op het web wordt gestart.
<br><br>
<pre><code>npm install || npm start</code></pre>

Na het starten van de server moet je de applicatie openen in je browser. Dit kun je doen door naar `http://localhost:3000` te gaan.

Wanneer je de applicatie opent, zie je een dashboard waarin je verschillende opties hebt om een thema te maken. Voordat je begint met het bouwen van een thema, is het belangrijk om ervoor te zorgen dat de vereiste pakketten correct zijn geïnstalleerd.
<br>
<br>

<img src="https://user-images.githubusercontent.com/118130116/225593324-0c56f9c7-2b96-49d6-8b5f-56816fb6963b.png" alt="License" width="10%"> 
<a href="https://github.com/AliAhmed205/Tech-22-23/blob/main/LICENSE">MIT License</a> 

<br>

