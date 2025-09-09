'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/Tooltip';
import { engagedLeadsApi } from '@/lib/api';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Star, 
  ExternalLink,
  Mail,
  Heart,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface EngagedLead {
  username: string;
  follower_count: number;
  engagement_rate: number;
  interaction_frequency: number;
  collaboration_score: number;
  last_interaction: string;
  bio_snippet: string;
  recommended_action: string;
  contact_priority: string;
}

interface ContactSuggestion {
  method: string;
  template: string;
  success_rate: string;
  best_time: string;
}

export default function EngagedLeadsPage() {
  const [engagedLeads, setEngagedLeads] = useState<EngagedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [contactSuggestions, setContactSuggestions] = useState<any>(null);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);

  useEffect(() => {
    fetchEngagedLeads();
  }, []);

  const fetchEngagedLeads = async () => {
    try {
      setLoading(true);
      const data = await engagedLeadsApi.analyze(20);
      setEngagedLeads(data.engaged_leads || []);
      setTotalAnalyzed(data.total_analyzed || 0);
    } catch (error) {
      console.error('Error fetching engaged leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactSuggestions = async (username: string) => {
    try {
      const suggestions = await engagedLeadsApi.getContactSuggestions(username);
      setContactSuggestions(suggestions);
      setSelectedLead(username);
    } catch (error) {
      console.error('Error fetching contact suggestions:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Engaged Leads</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Engaged Leads</h1>
          <p className="text-gray-600 mt-1">
            Most engaged followers from your target audience - perfect for collaborations
          </p>
        </div>
        <Button onClick={fetchEngagedLeads} className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Refresh Analysis</span>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Total Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{totalAnalyzed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engagedLeads.filter(lead => lead.contact_priority === 'High').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engagedLeads.length > 0 ? 
                    (engagedLeads.reduce((sum, lead) => sum + lead.engagement_rate, 0) / engagedLeads.length).toFixed(1) 
                    : '0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Top Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {engagedLeads.length > 0 ? Math.max(...engagedLeads.map(lead => lead.collaboration_score)).toFixed(1) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engaged Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-primary-600" />
            <Tooltip content="These are your most engaged followers who regularly interact with your content and have significant followings themselves. They're ranked by collaboration potential.">
              <span className="cursor-help">Most Engaged Target Audience Followers ℹ️</span>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagedLeads.map((lead, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <a 
                          href={`https://www.tiktok.com/@${lead.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          @{lead.username}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(lead.contact_priority)}`}>
                          {lead.contact_priority} Priority
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <Tooltip content="Collaboration score based on follower count, engagement rate, and interaction frequency with your content.">
                            <span className="text-sm font-medium cursor-help">{lead.collaboration_score}/10</span>
                          </Tooltip>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{lead.bio_snippet}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <Tooltip content="Number of followers this user has">
                              <span className="cursor-help">{formatNumber(lead.follower_count)} followers</span>
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <Tooltip content="Average engagement rate on their posts">
                              <span className="cursor-help">{lead.engagement_rate}% engagement</span>
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <Tooltip content="How often they interact with your content per week">
                              <span className="cursor-help">{lead.interaction_frequency}x/week</span>
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{lead.last_interaction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => fetchContactSuggestions(lead.username)}
                      className="flex items-center space-x-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Contact Tips</span>
                    </Button>
                    <p className="text-xs text-gray-500 text-center">{lead.recommended_action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Suggestions Modal */}
      {selectedLead && contactSuggestions && (
        <Card className="border-2 border-primary-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-600" />
                Contact Suggestions for @{selectedLead}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {setSelectedLead(null); setContactSuggestions(null);}}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Contact Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Recommended Contact Methods</h3>
                <div className="space-y-3">
                  {contactSuggestions.contact_methods?.map((method: ContactSuggestion, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{method.method}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 font-medium">{method.success_rate} success</span>
                          <span className="text-sm text-gray-500">• {method.best_time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{method.template}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collaboration Ideas */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Collaboration Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {contactSuggestions.collaboration_ideas?.map((idea: string, index: number) => (
                    <div key={index} className="p-2 bg-primary-50 rounded text-sm text-primary-700">
                      • {idea}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
