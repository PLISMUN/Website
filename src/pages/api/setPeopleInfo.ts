import { NextApiRequest, NextApiResponse } from 'next';
import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return res.status(500).json({ message: 'Server error: Missing env variables' });
  }
  
  const { email, name, birth, nationality, delegation, diet, notes } = req.body;
  //TODO validate input data

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 100
  ) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ message: 'Name must be 100 characters or fewer' });
  }
  const birthDate = new Date(birth);
  const now = new Date();
  const eightyYearsAgo = new Date(now.getFullYear() - 80, now.getMonth(), now.getDate());
  const sevenYearsAgo = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
  
  if (typeof birth !== 'string' || 
    !/^\d{4}-\d{2}-\d{2}$/.test(birth) ||
    birthDate < eightyYearsAgo ||
    birthDate > sevenYearsAgo
  ) {
    return res.status(400).json({ message: 'Invalid birthday' });
  }

  const validNationalities = [
  "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan",
  "The Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
  "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde (Cape Verde)", "Cambodia", "Cameroon", "Canada", "Cayman Islands",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Democratic Republic of the Congo", "Republic of the Congo", "Costa Rica", "Côte d’Ivoire",
  "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini (Swaziland)", "Ethiopia",
  "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
  "Gabon", "The Gambia", "Gaza Strip", "Georgia", "Germany", "Ghana", "Greece",
  "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea",
  "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy",
  "Jamaica", "Japan", "Jersey", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Macau", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Macedonia", "Northern Mariana Islands", "Norway",
  "Oman",
  "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Puerto Rico",
  "Qatar",
  "Réunion", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "Spain", "Sri Lanka", "Sudan", "South Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "United States Virgin Islands", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "West Bank",
  "Yemen",
  "Zambia", "Zimbabwe"
];

if (typeof nationality !== 'string' ||
  !validNationalities.includes(nationality)) {
    return res.status(400).json({ message: 'Invalid nationality' });
}

if (typeof delegation !== 'string' || delegation.length > 100) {
    return res.status(400).json({ message: 'Delegation must be 100 characters or fewer' });
}

const validDiets = [
  "None", "Vegetarian", "Vegan", "Other"
];
if (typeof diet !== 'string' || !validDiets.includes(diet)) {
    return res.status(400).json({ message: 'Invalid diet option' });
}

if (typeof notes !== 'string' || notes.length > 500) {
    return res.status(400).json({ message: 'Notes must be 500 characters or fewer' });
}

  try {
    const turso = getTursoClient()

    const userResult = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    await turso.execute({
      sql: 'DELETE FROM people WHERE id = ?',
      args: [userId],
    });

    await turso.execute({
      sql: 'INSERT INTO people (id, name, birth, nationality, delegation, diet, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [userId, name, birth, nationality, delegation, diet, notes],
    });
    
    res.status(200).json({ message: 'Signup successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Something went wrong' });
  }
}