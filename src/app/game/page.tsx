import { Metadata } from "next";
import GameInterface from "@/components/game/GameInterface";

export const metadata: Metadata = {
  title: "Play Paperclip Clicker",
  description: "Click to make paperclips in this addictive idle game",
};

export default function GamePage() {
  return (
    <>
      {/* Add a script to prevent F5/refresh via keyboard */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('keydown', function(e) {
            // Prevent F5 and Ctrl+R from refreshing the page
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
              e.preventDefault();
              console.log('Page refresh prevented');
              // Trigger save instead
              if (window.saveGameNow) {
                window.saveGameNow();
              }
              // Show a small notification to the user
              const notification = document.createElement('div');
              notification.style.position = 'fixed';
              notification.style.top = '10px';
              notification.style.left = '50%';
              notification.style.transform = 'translateX(-50%)';
              notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              notification.style.color = 'white';
              notification.style.padding = '8px 16px';
              notification.style.borderRadius = '4px';
              notification.style.zIndex = '9999';
              notification.textContent = 'Page refresh prevented. Your game is saved automatically.';
              document.body.appendChild(notification);
              setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                  document.body.removeChild(notification);
                }, 500);
              }, 3000);
            }
          });
          
          // Also prevent the browser's reload button
          window.addEventListener('beforeunload', function(e) {
            // This will trigger the browser's "Leave Site?" dialog
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = '';
            return '';
          });
        `
      }} />
      <GameInterface />
    </>
  );
}
