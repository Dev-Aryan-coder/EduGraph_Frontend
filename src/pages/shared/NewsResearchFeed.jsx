import React, { useState, useEffect } from 'react'
import sharedService from '../../services/sharedService'
import {
  IconSearch,
  IconPlus,
  IconArrowLeft,
  IconBook,
  IconCheck,
  IconX,
  IconClock,
  IconFileText,
  IconGlobe,
  IconAlertTriangle
} from '../../components/common/Icons'
import './NewsResearchFeed.css'

export default function NewsResearchFeed({ onBack }) {
  const [activeTab, setActiveTab] = useState('research') // 'news' | 'research'
  const [newsList, setNewsList] = useState([])
  const [researchList, setResearchList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Upload Research Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [docAbstract, setDocAbstract] = useState('')
  const [docAuthors, setDocAuthors] = useState('')
  const [docDomain, setDocDomain] = useState('')
  const [docUrl, setDocUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadFeeds()
  }, [])

  const loadFeeds = async () => {
    setIsLoading(true)
    try {
      const [news, research] = await Promise.all([
        sharedService.getAllNews(),
        sharedService.getAllResearchDocs()
      ])
      setNewsList(news || [])
      setResearchList(research || [])
    } catch (err) {
      console.error('Error fetching feeds:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadResearch = async (e) => {
    e.preventDefault()
    if (!docTitle.trim() || !docAbstract.trim()) return

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await sharedService.uploadResearchDoc({
        title: docTitle.trim(),
        abstractText: docAbstract.trim(),
        authors: docAuthors.trim(),
        domain: docDomain.trim(),
        documentUrl: docUrl.trim()
      })
      setIsModalOpen(false)
      setDocTitle('')
      setDocAbstract('')
      setDocAuthors('')
      setDocDomain('')
      setDocUrl('')
      loadFeeds()
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload research document.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredNews = newsList.filter(n =>
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredResearch = researchList.filter(r =>
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.abstractText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="feed-root">
      {/* Top Header */}
      <header className="feed-header">
        <div className="feed-header-left">
          {onBack && (
            <button className="feed-back-btn" onClick={onBack}>
              <IconArrowLeft size={16} /> Back
            </button>
          )}
          <div className="feed-title-wrap">
            <h2>Campus Intelligence & Academic Research Hub</h2>
            <p>Institutional news releases and peer-reviewed faculty & student research publications</p>
          </div>
        </div>

        <div className="feed-header-right">
          <button className="btn-upload-research" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={16} /> Publish Research Paper
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="feed-content-container">
        {/* Navigation & Search Bar */}
        <div className="feed-toolbar">
          <div className="feed-tabs">
            <button
              className={`feed-tab ${activeTab === 'research' ? 'active' : ''}`}
              onClick={() => setActiveTab('research')}
            >
              <IconBook size={16} />
              <span>Research Publications ({researchList.length})</span>
            </button>
            <button
              className={`feed-tab ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              <IconFileText size={16} />
              <span>Campus News ({newsList.length})</span>
            </button>
          </div>

          <div className="feed-search-wrap">
            <IconSearch size={16} />
            <input
              type="text"
              placeholder="Search papers, authors, or articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Stream */}
        {isLoading ? (
          <div className="feed-loading">
            <div className="quiz-spinner" />
            <p>Loading academic publications and news...</p>
          </div>
        ) : activeTab === 'research' ? (
          /* Research Tab */
          filteredResearch.length === 0 ? (
            <div className="feed-empty">
              <IconBook size={44} color="#94A3B8" />
              <h3>No Research Publications Found</h3>
              <p>Be the first scholar to publish a research paper or conference article!</p>
              <button className="btn-upload-research" onClick={() => setIsModalOpen(true)}>
                <IconPlus size={16} /> Publish Research
              </button>
            </div>
          ) : (
            <div className="research-grid">
              {filteredResearch.map(doc => (
                <article key={doc.id} className="research-card">
                  <div className="research-card-top">
                    <span className="research-domain-badge">{doc.domain || 'Academic Research'}</span>
                    <span className="research-date">
                      <IconClock size={13} />
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="research-card-title">{doc.title}</h3>
                  <p className="research-authors">Authors: <strong>{doc.authors || 'College Scholar'}</strong></p>

                  <p className="research-abstract">{doc.abstractText}</p>

                  <div className="research-card-footer">
                    {doc.documentUrl ? (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="research-link"
                      >
                        <IconGlobe size={14} /> Open Full Paper / DOI →
                      </a>
                    ) : (
                      <span className="research-archived-tag">Archived in EduGraph Repository</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          /* Campus News Tab */
          filteredNews.length === 0 ? (
            <div className="feed-empty">
              <IconFileText size={44} color="#94A3B8" />
              <h3>No News Articles Found</h3>
              <p>Check back later for institutional press releases and college news.</p>
            </div>
          ) : (
            <div className="news-stream">
              {filteredNews.map(item => (
                <article key={item.id} className="news-card">
                  <div className="news-card-header">
                    <span className="news-date">
                      <IconClock size={13} />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-content">{item.content}</p>
                </article>
              ))}
            </div>
          )
        )}
      </div>

      {/* Upload Research Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="feed-modal-card">
            <div className="modal-header">
              <h3>Publish Academic Research Paper</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                <IconX size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="feed-modal-alert">
                <IconAlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUploadResearch} className="feed-modal-form">
              <div className="form-group">
                <label>Paper Title *</label>
                <input
                  type="text"
                  className="feed-input"
                  placeholder="e.g. Distributed Consensus in Cloud Edge Architectures"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Author(s) *</label>
                <input
                  type="text"
                  className="feed-input"
                  placeholder="e.g. Aryan Pawar, Dr. K. Sharma"
                  value={docAuthors}
                  onChange={(e) => setDocAuthors(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Domain / Field</label>
                <input
                  type="text"
                  className="feed-input"
                  placeholder="e.g. Computer Science, AI/ML, Nanotechnology"
                  value={docDomain}
                  onChange={(e) => setDocDomain(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Abstract / Executive Summary *</label>
                <textarea
                  className="feed-textarea"
                  placeholder="Summarize the core hypothesis, methodology, and empirical findings..."
                  value={docAbstract}
                  onChange={(e) => setDocAbstract(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label>External Document URL / DOI Link</label>
                <input
                  type="url"
                  className="feed-input"
                  placeholder="https://doi.org/... or https://arxiv.org/..."
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : (
                    <>
                      <IconCheck size={16} /> Publish to Repository
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}