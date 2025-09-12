/**
 * Content generation utilities for applications and profiles
 */

/**
 * Generates a personalized cover letter for job applications
 * @param {Object} job - Job object with title and company
 * @param {Object} user - User object with profile information
 * @returns {string} Generated cover letter
 */
export const generateCoverLetter = (job, user) => {
  return `Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${job.company}. 

With my background in ${user?.industry || 'technology'} and experience as a ${user?.current_job_title || 'professional'}, I am confident that I would be a valuable addition to your team.

I am particularly drawn to this opportunity because of ${job.company}'s reputation in the industry and the chance to contribute to meaningful projects.

I look forward to the opportunity to discuss how my skills and experience align with your needs.

Best regards,
${user?.first_name} ${user?.last_name}`
}

/**
 * Generates a concise professional profile summary
 * @param {Object} user - User object with profile information
 * @returns {string} Generated profile summary
 */
export const generateProfileSummary = (user) => {
  return `${user?.first_name} ${user?.last_name} is a ${user?.current_job_title || 'professional'} with experience in ${user?.industry || 'technology'}. Based in ${user?.location || 'various locations'}, they bring expertise and dedication to their work.`
}

/**
 * Generates a formatted experience summary from user's work history
 * @param {Object} user - User object with experience array
 * @returns {string} Generated experience summary
 */
export const generateExperienceSummary = (user) => {
  if (!user?.experience || user.experience.length === 0) {
    return 'Experience details available upon request.'
  }
  
  return user.experience.map(exp => 
    `${exp.title} at ${exp.company} (${exp.period}) - ${exp.description || 'Key responsibilities and achievements.'}`
  ).join('\n\n')
}

/**
 * Generates a formatted education summary from user's education history
 * @param {Object} user - User object with education array
 * @returns {string} Generated education summary
 */
export const generateEducationSummary = (user) => {
  if (!user?.education || user.education.length === 0) {
    return 'Education details available upon request.'
  }
  
  return user.education.map(edu => 
    `${edu.level} in ${edu.program} from ${edu.school} (${edu.period})`
  ).join('\n')
}

/**
 * Gets the appropriate color for different content types
 * @param {string} type - Content type (job, opportunity, tender, course)
 * @returns {string} Hex color code
 */
export const getTypeColor = (type) => {
  switch (type) {
    case 'job': return '#16a34a'
    case 'opportunity': return '#3b82f6'
    case 'tender': return '#dc2626'
    case 'course': return '#7c3aed'
    default: return '#64748b'
  }
}

/**
 * Gets the appropriate icon for different content types
 * @param {string} type - Content type (job, opportunity, tender, course)
 * @returns {string} Icon name or component
 */
export const getTypeIcon = (type) => {
  switch (type) {
    case 'job': return 'Briefcase'
    case 'opportunity': return 'Target'
    case 'tender': return 'FileText'
    case 'course': return 'BookOpen'
    default: return 'Circle'
  }
}
