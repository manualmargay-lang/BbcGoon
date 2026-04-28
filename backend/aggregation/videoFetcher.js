/**
 * Video Aggregation Module
 * Fetches and aggregates videos from all supported platforms
 */

const axios = require('axios');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Platform configurations
const PLATFORMS = {
  reddit: {
    baseUrl: 'https://oauth.reddit.com',
    endpoints: {
      popular: '/r/popular/hot',
      home: '/',
      search: '/r/{subreddit}/search'
    }
  },
  x: {
    baseUrl: 'https://api.twitter.com/2',
    endpoints: {
      search: '/tweets/search/recent'
    }
  }
};

/**
 * Fetch videos from Reddit
 */
async function fetchRedditVideos(accessToken, limit = 25) {
  try {
    const response = await axios.get(
      `${PLATFORMS.reddit.baseUrl}/r/popular/hot`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'BbcGoon/1.0'
        },
        params: {
          limit: limit,
          raw_json: 1
        }
      }
    );

    const videos = [];
    for (const post of response.data.data.children) {
      const data = post.data;
      
      // Only collect video posts
      if (data.is_video || data.media?.type === 'giphy.gif') {
        videos.push({
          platform: 'reddit',
          platform_video_id: data.id,
          title: data.title,
          description: data.selftext,
          video_url: data.url,
          thumbnail_url: data.thumbnail,
          platform_user: data.author,
          tags: data.link_flair_text ? [data.link_flair_text] : [],
          captions: data.title + ' ' + data.selftext,
          duration_seconds: null,
          view_count: data.ups,
          created_at: new Date(data.created_utc * 1000)
        });
      }
    }

    return videos;
  } catch (error) {
    console.error('Reddit fetch error:', error);
    return [];
  }
}

/**
 * Fetch videos from X/Twitter
 */
async function fetchXVideos(accessToken, query = 'video', limit = 25) {
  try {
    const response = await axios.get(
      `${PLATFORMS.x.baseUrl}/tweets/search/recent`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          query: `${query} has:video`,
          max_results: limit,
          'tweet.fields': 'created_at,public_metrics',
          'media.fields': 'media_key,type,url'
        }
      }
    );

    const videos = [];
    if (response.data.data) {
      for (const tweet of response.data.data) {
        videos.push({
          platform: 'x',
          platform_video_id: tweet.id,
          title: tweet.text.substring(0, 500),
          description: tweet.text,
          video_url: tweet.url,
          thumbnail_url: null,
          platform_user: 'twitter_user', // Would need to join with includes.users
          tags: tweet.text.match(/#\w+/g) || [],
          captions: tweet.text,
          duration_seconds: null,
          view_count: tweet.public_metrics.like_count,
          created_at: new Date(tweet.created_at)
        });
      }
    }

    return videos;
  } catch (error) {
    console.error('X fetch error:', error);
    return [];
  }
}

/**
 * Save videos to database
 */
async function saveVideos(videos) {
  try {
    const saved = [];
    
    for (const video of videos) {
      const result = await db.query(
        `INSERT INTO videos 
         (platform, platform_video_id, title, description, video_url, thumbnail_url,
          platform_user, tags, captions, duration_seconds, view_count, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (platform, platform_video_id) DO UPDATE SET
         view_count = $11, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          video.platform,
          video.platform_video_id,
          video.title,
          video.description,
          video.video_url,
          video.thumbnail_url,
          video.platform_user,
          JSON.stringify(video.tags),
          video.captions,
          video.duration_seconds,
          video.view_count,
          video.created_at
        ]
      );

      saved.push(result.rows[0]);
    }

    return saved;
  } catch (error) {
    console.error('Failed to save videos:', error);
    return [];
  }
}

/**
 * Fetch and process videos from all platforms for a user
 */
async function aggregateVideos(userId) {
  try {
    // Get user's platform connections
    const connectionsResult = await db.query(
      `SELECT * FROM platform_connections WHERE user_id = $1`,
      [userId]
    );

    const connections = connectionsResult.rows;
    const allVideos = [];

    // Fetch from Reddit
    const redditConn = connections.find(c => c.platform === 'reddit');
    if (redditConn && redditConn.access_token) {
      const redditVideos = await fetchRedditVideos(redditConn.access_token);
      allVideos.push(...redditVideos);
    }

    // Fetch from X
    const xConn = connections.find(c => c.platform === 'x');
    if (xConn && xConn.access_token) {
      const xVideos = await fetchXVideos(xConn.access_token);
      allVideos.push(...xVideos);
    }

    // Save to database
    const savedVideos = await saveVideos(allVideos);

    return savedVideos;
  } catch (error) {
    console.error('Aggregation error:', error);
    throw error;
  }
}

/**
 * Get recent videos (unfiltered)
 */
async function getRecentVideos(limit = 50) {
  try {
    const result = await db.query(
      `SELECT * FROM videos ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch recent videos:', error);
    throw error;
  }
}

/**
 * Search videos by platform
 */
async function searchByPlatform(platform, limit = 25) {
  try {
    const result = await db.query(
      `SELECT * FROM videos WHERE platform = $1 ORDER BY created_at DESC LIMIT $2`,
      [platform, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to search videos:', error);
    throw error;
  }
}

module.exports = {
  fetchRedditVideos,
  fetchXVideos,
  saveVideos,
  aggregateVideos,
  getRecentVideos,
  searchByPlatform
};
