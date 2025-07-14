// API 服务文件
const BASE_URL = 'https://bhapp.bohe.cn';

// 通用请求方法
const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Banner API
export const getBannerData = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/banner`);
    
    if (response.errno === 0) {
      return response.banners;
    } else {
      throw new Error(response.errmsg || '获取banner数据失败');
    }
  } catch (error) {
    console.error('获取banner数据失败:', error);
    throw error;
  }
};

// 今日热门新闻API
export const getHotNewsData = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/news`);
    if (response.errno === 0) {
      return response.news_data;
    } else {
      throw new Error(response.errmsg || '获取今日热门新闻失败');
    }
  } catch (error) {
    console.error('获取今日热门新闻失败:', error);
    throw error;
  }
};

// 严选专家医生API
export const getSelectedDoctors = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/doctor`);
    if (response.errno === 0) {
      // 返回完整响应，包含 nav 和 doctor_data
      return response;
    } else {
      throw new Error(response.errmsg || '获取严选专家失败');
    }
  } catch (error) {
    console.error('获取严选专家失败:', error);
    throw error;
  }
};

// 热门疾病API
export const getHotDiseases = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/disease`);
    if (response.errno === 0) {
      return response.disease_data;
    } else {
      throw new Error(response.errmsg || '获取热门疾病失败');
    }
  } catch (error) {
    console.error('获取热门疾病失败:', error);
    throw error;
  }
};

// 科普推荐API
export const getScienceArticles = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/newslist`);
    if (response.errno === 0) {
      return response.news_data;
    } else {
      throw new Error(response.errmsg || '获取科普推荐失败');
    }
  } catch (error) {
    console.error('获取科普推荐失败:', error);
    throw error;
  }
};

// 首页导航API
export const getNavData = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/nav`);
    if (response.errno === 0) {
      return response.nav;
    } else {
      throw new Error(response.errmsg || '获取导航数据失败');
    }
  } catch (error) {
    console.error('获取导航数据失败:', error);
    throw error;
  }
};

// 版本检查API
export const checkAppVersion = async (platform: string, currentVersion: string) => {
  try {
    console.log('=== 版本检查API请求 ===');
    console.log('请求URL:', `${BASE_URL}/article_api/app/version`);
    console.log('请求方法:', 'POST');
    console.log('请求参数:', {
      platform: platform,
      current_version: currentVersion,
    });
    
    const requestBody = JSON.stringify({
      platform: platform,
      current_version: currentVersion,
    });
    console.log('请求体:', requestBody);
    
    const response = await fetch(`${BASE_URL}/article_api/app/version`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    console.log('=== 版本检查API响应 ===');
    console.log('HTTP状态码:', response.status);
    console.log('响应头:', response.headers);
    
    const data = await response.json();
    console.log('响应数据:', JSON.stringify(data, null, 2));
    console.log('响应errno:', data.errno);
    console.log('响应errmsg:', data.errmsg);
    console.log('响应data:', data.data);
    console.log('==================');
    
    if (data.errno === 0) {
      return data.data;
    } else {
      throw new Error(data.errmsg || '版本检查失败');
    }
  } catch (error) {
    console.error('=== 版本检查API错误 ===');
    console.error('错误类型:', error.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    console.error('==================');
    throw error;
  }
};

// 专科专病导航API
export const getDiseNavData = async () => {
  try {
    const response = await request(`${BASE_URL}/article_api/index/disenav`);
    if (response.errno === 0) {
      return {
        nav: response.nav,
        more_url: response.more_url
      };
    } else {
      throw new Error(response.errmsg || '获取专科专病导航数据失败');
    }
  } catch (error) {
    console.error('获取专科专病导航数据失败:', error);
    throw error;
  }
};

// 视频列表API
export const getVideoList = async (page = 1, uuid = '') => {
  let url = `${BASE_URL}/article_api/video/list?page=${page}`;
  if (uuid) url += `&uuid=${uuid}`;
  const response = await request(url);
  if (response.errno === 0) {
    return response.video_data;
  } else {
    throw new Error(response.errmsg || '获取视频列表失败');
  }
};

export default {
  getBannerData,
}; 