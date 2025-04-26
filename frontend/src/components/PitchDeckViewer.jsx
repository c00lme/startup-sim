import React from 'react';
import { Deck, Slide, Box } from 'spectacle';

// Spectacle-based viewer for the generated pitch deck
export default function PitchDeckViewer({ pitchDeck }) {
  // Split slides by blank lines
  const slides = pitchDeck.split('\n\n');
  return (
    <Deck>
      {slides.map((content, idx) => (
        <Slide key={idx} backgroundColor="white">
          <Box fontSize="1.5rem" color="#333" textAlign="left" padding="1em">
            {content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </Box>
        </Slide>
      ))}
    </Deck>
  );
}
