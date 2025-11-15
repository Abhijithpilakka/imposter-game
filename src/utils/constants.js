export const WORD_CATEGORIES = {
  cricket: [
    'Virat Kohli', 'MS Dhoni', 'Sachin Tendulkar', 'Rohit Sharma', 'Jasprit Bumrah',
    'Steve Smith', 'AB de Villiers', 'Chris Gayle', 'Shane Warne', 'Ricky Ponting',
    'IPL', 'World Cup', 'Test Match', 'T20', 'ODI',
    'Boundary', 'Six', 'Wicket', 'Century', 'Hat-trick',
    'Stumps', 'Batting', 'Bowling', 'Fielding', 'Umpire',
    'Run Out', 'LBW', 'Maiden Over', 'Yorker', 'Bouncer'
  ],
  
  football: [
    'Lionel Messi', 'Cristiano Ronaldo', 'Neymar', 'Kylian Mbappe', 'Pele',
    'Diego Maradona', 'Zinedine Zidane', 'Ronaldinho', 'David Beckham', 'Thierry Henry',
    'World Cup', 'Champions League', 'Premier League', 'La Liga', 'Barcelona',
    'Real Madrid', 'Manchester United', 'Liverpool', 'Bayern Munich', 'Penalty',
    'Goal', 'Offside', 'Free Kick', 'Corner', 'Yellow Card',
    'Red Card', 'Hat-trick', 'Goalkeeper', 'Striker', 'Midfielder'
  ],
  
  celebrities: [
    'Taylor Swift', 'Beyoncé', 'Rihanna', 'Ariana Grande', 'Justin Bieber',
    'Drake', 'The Weeknd', 'Ed Sheeran', 'Billie Eilish', 'Lady Gaga',
    'Leonardo DiCaprio', 'Tom Cruise', 'Brad Pitt', 'Johnny Depp', 'Robert Downey Jr',
    'Scarlett Johansson', 'Jennifer Lawrence', 'Emma Watson', 'Dwayne Johnson', 'Will Smith',
    'Kim Kardashian', 'Kylie Jenner', 'Oprah Winfrey', 'Ellen DeGeneres', 'Jimmy Fallon',
    'Elon Musk', 'Mark Zuckerberg', 'Jeff Bezos', 'Shah Rukh Khan', 'Amitabh Bachchan'
  ],
  
  general: [
    'Pizza', 'Eiffel Tower', 'Batman', 'iPhone', 'Coffee',
    'Harry Potter', 'Coca-Cola', 'Christmas', 'Titanic', 'Einstein',
    'Pikachu', 'Netflix', 'Spider-Man', 'Ferrari', 'YouTube',
    'Shakespeare', 'Paris', 'Ocean', 'Mountain', 'Dragon',
    'Rainbow', 'Guitar', 'Superhero', 'Disney', 'Basketball',
    'Soccer', 'Laptop', 'Instagram', 'Amazon', 'Google'
  ]
};

export const CATEGORIES = [
  { id: 'cricket', name: 'Cricket', emoji: '🏏' },
  { id: 'football', name: 'Football', emoji: '⚽' },
  { id: 'celebrities', name: 'Celebrities', emoji: '⭐' },
  { id: 'general', name: 'General', emoji: '🎯' }
];

export const GAME_STATES = {
  LOBBY: 'lobby',
  PLAYING: 'playing',
  VOTING: 'voting',
  FINISHED: 'finished'
};