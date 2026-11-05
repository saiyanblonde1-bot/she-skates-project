/* =========================================================
   She Skates — script.js
   Part 3: form validation, AJAX submission and form responses
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Helper functions ---------- */

    // Shows a message under a field (an empty message clears the error)
    function setError(errorId, message) {
        var el = document.getElementById(errorId);
        if (el) {
            el.textContent = message;
        }
    }

    // Email must look like name@domain.com
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // Phone must be 10 digits starting with 0 (South African format)
    function isValidPhone(value) {
        return /^0[0-9]{9}$/.test(value);
    }

    /* ---------- ENQUIRY FORM ---------- */

    var enquiryForm = document.getElementById('enquiry-form');

    // This script is linked on every page, so only run this
    // section if the enquiry form actually exists on the page
    if (enquiryForm) {

        // Today's date in YYYY-MM-DD format, using the visitor's local time
        var today = new Date().toLocaleDateString('en-CA');
        document.getElementById('start-date').min = today;

        enquiryForm.addEventListener('submit', function (event) {
            // Stop the page from reloading so JavaScript can check the form first
            event.preventDefault();

            // Read what the visitor typed
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var interest = document.getElementById('interest').value;
            var startDate = document.getElementById('start-date').value;
            var message = document.getElementById('message').value.trim();

            var valid = true;

            // Check each field and show a specific error message if it fails
            if (name.length < 2) {
                setError('name-error', 'Please enter your full name (at least 2 characters).');
                valid = false;
            } else {
                setError('name-error', '');
            }

            if (!isValidEmail(email)) {
                setError('email-error', 'Please enter a valid email address, e.g. name@example.com.');
                valid = false;
            } else {
                setError('email-error', '');
            }

            if (!isValidPhone(phone)) {
                setError('phone-error', 'Please enter a 10-digit phone number starting with 0.');
                valid = false;
            } else {
                setError('phone-error', '');
            }

            if (interest === '') {
                setError('interest-error', 'Please choose volunteering or sponsoring.');
                valid = false;
            } else {
                setError('interest-error', '');
            }

            if (startDate === '') {
                setError('date-error', 'Please choose a start date.');
                valid = false;
            } else if (startDate < today) {
                setError('date-error', 'The start date cannot be in the past.');
                valid = false;
            } else {
                setError('date-error', '');
            }

            if (message.length < 10) {
                setError('message-error', 'Please write a message of at least 10 characters.');
                valid = false;
            } else {
                setError('message-error', '');
            }

            // If anything failed, stop here. The error messages are already showing.
            if (!valid) {
                document.getElementById('enquiry-response').textContent = '';
                return;
            }

            /* ---------- AJAX submission ---------- */
            var responseEl = document.getElementById('enquiry-response');
            responseEl.textContent = 'Sending your enquiry...';

            var formData = {
                name: name,
                email: email,
                phone: phone,
                interest: interest,
                startDate: startDate,
                message: message
            };

            // fetch() sends the data to the form's action URL without reloading the page
            fetch(enquiryForm.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Server error');
                }
                return response.json();
            })
            .then(function () {
                // The enquiry was received, so show a response based on what they chose
                var reply;

                if (interest === 'volunteer') {
                    reply = 'Thank you, ' + name + '! Volunteering with She Skates is free, and we currently have 8 volunteer spots open. We will phone you on ' + phone + ' before ' + startDate + ' to arrange your induction.';
                } else {
                    reply = 'Thank you, ' + name + '! Sponsoring a skater costs R250 per month, which covers skates, safety gear and coaching. We currently have 12 sponsored places available, and we will email ' + email + ' with the details.';
                }

                responseEl.textContent = reply;
                enquiryForm.reset();
            })
            .catch(function () {
                // Network problem or server error
                responseEl.textContent = 'Sorry, something went wrong sending your enquiry. Please check your internet connection and try again.';
            });
        });
    }

     /* ---------- CONTACT FORM ---------- */

    var contactForm = document.getElementById('contact-form');

    // Only run if the contact form exists on this page
    if (contactForm) {

        contactForm.addEventListener('submit', function (event) {
            // Stop the page reloading so JavaScript can check the form first
            event.preventDefault();

            // Read what the visitor typed
            var name = document.getElementById('c-name').value.trim();
            var email = document.getElementById('c-email').value.trim();
            var phone = document.getElementById('c-phone').value.trim();
            var topic = document.getElementById('c-topic').value;
            var message = document.getElementById('c-message').value.trim();

            var preview = document.getElementById('email-preview');
            var valid = true;

            // Check each field and show a specific error if it fails
            if (name.length < 2) {
                setError('c-name-error', 'Please enter your full name (at least 2 characters).');
                valid = false;
            } else {
                setError('c-name-error', '');
            }

            if (!isValidEmail(email)) {
                setError('c-email-error', 'Please enter a valid email address, e.g. name@example.com.');
                valid = false;
            } else {
                setError('c-email-error', '');
            }

            if (!isValidPhone(phone)) {
                setError('c-phone-error', 'Please enter a 10-digit phone number starting with 0.');
                valid = false;
            } else {
                setError('c-phone-error', '');
            }

            if (topic === '') {
                setError('c-topic-error', 'Please choose the type of message.');
                valid = false;
            } else {
                setError('c-topic-error', '');
            }

            if (message.length < 10) {
                setError('c-message-error', 'Please write a message of at least 10 characters.');
                valid = false;
            } else {
                setError('c-message-error', '');
            }

            // If anything failed, hide any old preview and stop here
            if (!valid) {
                preview.hidden = true;
                return;
            }

            // The recipient is stated in the form's action attribute in contact.html
            var recipient = contactForm.getAttribute('action').replace('mailto:', '');

            // Compile the email: subject line and body text
            var subject = 'She Skates message: ' + topic;
            var body = 'Name: ' + name + '\n' +
                       'Email: ' + email + '\n' +
                       'Phone: ' + phone + '\n' +
                       'Message type: ' + topic + '\n\n' +
                       message;

            // Show the compiled email on the page so the visitor can check it
            document.getElementById('email-summary').textContent =
                'To: ' + recipient + '\n' +
                'Subject: ' + subject + '\n\n' +
                body;

            // This mailto: link opens the visitor's email app with everything filled in
            document.getElementById('send-email-link').href =
                'mailto:' + recipient +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            preview.hidden = false;
        });
    }
    
     /* ---------- INTERACTIVE MAP (Leaflet) ---------- */

    // Only run if this page has a map box and the Leaflet library loaded
    if (document.getElementById('map') && typeof L !== 'undefined') {

        // Approximate coordinates for the two locations (the street addresses are fictional)
        var locations = [
            { name: 'She Skates Vaal', address: '123 Example Street, Vaal', lat: -26.6731, lng: 27.9261 },
            { name: 'She Skates Sebokeng', address: '456 Example Avenue, Sebokeng', lat: -26.5878, lng: 27.8400 }
        ];

        // Create the map and add the OpenStreetMap tiles (the map pictures)
        var map = L.map('map');
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, TomTom, and other contributors'
        }).addTo(map);
        // Add one marker per location, each with a popup that opens when clicked
        var points = [];
        locations.forEach(function (place) {
            L.marker([place.lat, place.lng])
                .addTo(map)
                .bindPopup('<strong>' + place.name + '</strong><br>' + place.address);
            points.push([place.lat, place.lng]);
        });

        // Zoom the map so both markers are visible
        map.fitBounds(points, { padding: [40, 40] });
    } 
    
      /* ---------- ACCORDION (FAQ on services page) ---------- */

    var accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var panel = document.getElementById(header.getAttribute('aria-controls'));
            var isOpen = header.getAttribute('aria-expanded') === 'true';

            // Close every panel first, so only one is open at a time
            accordionHeaders.forEach(function (other) {
                other.setAttribute('aria-expanded', 'false');
                document.getElementById(other.getAttribute('aria-controls')).style.maxHeight = null;
            });

            // Open the clicked panel, unless it was already open (then it stays closed)
            if (!isOpen) {
                header.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });  

    /* ---------- DYNAMIC PROGRAMMES: search, filter and sort (services page) ---------- */

    var programmeGrid = document.getElementById('programme-grid');

    // Only run on pages that have the programme grid
    if (programmeGrid) {

        // The programme data. JavaScript builds the cards from this list.
        // To add a programme, add another { ... } line here.
        var programmes = [
            { name: 'Beginner Skate Lessons', ages: 'Girls and women, 7 to 35', day: 'Saturday', description: 'Weekly sessions for girls and women who want to learn how to skate, helping to build confidence in young women.' },
            { name: 'Beke le Beke Girls', ages: 'Girls 7 to 18 and women 18 to 35', day: 'Wednesday', description: 'Open to girls from age 7 to 18 and women from 18 to 35. Lessons are given to each individual.' },
            { name: 'Junior Skate Club', ages: 'Girls 7 to 12', day: 'Sunday', description: 'A relaxed club where younger girls practise balance and simple tricks with friends and a coach.' },
            { name: "Women's Social Skate Night", ages: 'Women 18 to 35', day: 'Wednesday', description: 'An evening session for women to skate together, practise tricks and meet other skaters.' },
            { name: 'Skate Safety and Gear Workshop', ages: 'Girls and women, 7 to 35', day: 'Sunday', description: 'Learn how to fit your helmet and pads, how to fall safely and how to look after your board.' }
        ];

        var searchBox = document.getElementById('programme-search');
        var filterSelect = document.getElementById('programme-filter');
        var sortSelect = document.getElementById('programme-sort');
        var countEl = document.getElementById('programme-count');

        // Works out which programmes to show, then rebuilds the cards on the page
        function showProgrammes() {
            var searchText = searchBox.value.trim().toLowerCase();
            var day = filterSelect.value;

            // 1. Filter: keep programmes that match the search text and the chosen day
            var results = programmes.filter(function (p) {
                var matchesSearch = (p.name + ' ' + p.description).toLowerCase().indexOf(searchText) !== -1;
                var matchesDay = (day === 'all') || (p.day === day);
                return matchesSearch && matchesDay;
            });

            // 2. Sort by name (A to Z, or reversed for Z to A)
            results.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            if (sortSelect.value === 'za') {
                results.reverse();
            }

            // 3. Clear the grid, then create a card for each result
            programmeGrid.innerHTML = '';

            results.forEach(function (p) {
                var card = document.createElement('div');
                card.className = 'programme-card';

                var title = document.createElement('h2');
                title.textContent = p.name;

                var details = document.createElement('p');
                details.textContent = p.ages + ' | ' + p.day;

                var text = document.createElement('p');
                text.textContent = p.description;

                card.appendChild(title);
                card.appendChild(details);
                card.appendChild(text);
                programmeGrid.appendChild(card);
            });

            // 4. Tell the visitor what is showing
            if (results.length === 0) {
                countEl.textContent = 'No programmes match your search. Try a different word or day.';
            } else {
                countEl.textContent = 'Showing ' + results.length + ' of ' + programmes.length + ' programmes';
            }
        }

        // Update the list whenever the visitor types or changes a dropdown
        searchBox.addEventListener('input', showProgrammes);
        filterSelect.addEventListener('change', showProgrammes);
        sortSelect.addEventListener('change', showProgrammes);

        // Show all programmes when the page first loads
        showProgrammes();
    }
});

