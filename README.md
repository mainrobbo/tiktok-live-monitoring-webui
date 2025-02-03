# Tiktok Live Monitoring (WebUI)

This is the client-side application for **Tiktok Live Monitoring**, a real-time
TikTok Live stream monitoring tool. Built with **Next.js**, it provides a
user-friendly interface to monitor and analyze live stream activities such as
chats, gifts, viewers, subscribers, and more.

### Preview

![Tiktok Live Monitoring](https://i.imgur.com/2LYwEv7.png)

## Features

### Real-Time Monitoring

- **Chat List**: View real-time chat messages from the live stream.
- **Gift List**: Track gifts sent by viewers.
- **Viewer List**: See the list of active viewers.
- **Subscriber List**: Monitor new subscribers.
- **New Follower List**: Track new followers.
- **Like List**: View likes received during the stream.

### Analytics

- **Multi-Chart** - Visualize real-time data with charts for:
  - Total chats
  - Total gifts
  - Total viewers
  - Total subscribers
  - Total new followers
  - Total likes
- **Engagement Rate** - Calculate and display:
  - Average engagement rate
  - Engagement rate per X minutes
- **Leaderboards** - Identify top contributors and activities:
  - Most used words in chat
  - Most active chatters
  - Top gifters
  - Most gifts sent
  - Most likes given
  - Top likes received
  - Most active viewers (based on chat, gift, like activity, etc.)

### Data Management

- **Redux Logging**: All live stream data is stored in Redux for real-time
  access and analysis.
- **Export Data**: Export raw data as JSON (currently exports all data;
  selective export is an upcoming feature).

### Incoming Features

- **Stream Tools**:
  - Chat overlay for streaming software (e.g., OBS).
  - Interactive tools to engage with the stream using your own TikTok auth
    session.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/farizrifqi/tiktok-live-monitoring-webui.git
   cd adv-ttl-client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Connect to a TikTok Live Stream**:

   - Enter the TikTok username of the live streamer.
   - Click \"Connect\" to start monitoring the live stream.

2. **Monitor Real-Time Data**:

   - Use the dashboard to view chats, gifts, viewers, and other live stream
     activities.
   - Explore the analytics charts and leaderboards for insights.

3. **Export Data**:
   - Click the \"Export Data\" button to download the raw data as a JSON file.

## Note

Some packages listed in `package.json` may appear unused in the current
implementation. However, these packages have either been tested for future
features or are planned for upcoming functionality. Please do not remove them
unless confirmed unnecessary.

## Tech Stack

- [NextJS](https://github.com/vercel/next.js)
- [Redux](https://github.com/reduxjs/redux)
- [recharts](https://github.com/recharts/recharts)
- [Tailwind CSS](https://tailwindcss.com/)
- [lodash](https://github.com/lodash/lodash)
- [@tanstack/react-table](https://github.com/TanStack/table)

## License

This project is open-source and available under the
**[MIT License](https://opensource.org/licenses/MIT)**.

## Acknowledgments

- **[TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector/)**:
  For providing the core functionality to connect to TikTok Live streams.
- **[TikTok Live Monitoring (Server)](https://github.com/farizrifqi/tiktok-live-monitoring-server)**:
  The server-side component that powers this client (built-in proxy stream).
- **[Tiktok Live Proxy](https://github.com/farizrifqi/tiktok-live-proxy)**:
  Providing proxy stream only.

## Support

If you find this project useful, consider giving it a ⭐ on GitHub! For any
questions or issues, please open an issue in the repository.
