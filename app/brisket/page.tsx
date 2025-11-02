'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Button as MuiButton, Card, CardContent, Chip, IconButton } from '@mui/material';
import { Add, LocalFireDepartment, History, ArrowBack, Edit } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { BrisketTracker } from '@/components/brisket-tracker';
import { StartBrisketModal } from '@/components/start-brisket-modal';
import { BrisketEditModal } from '@/components/brisket-edit-modal';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';

export default function BrisketPage() {
  const [activeSession, setActiveSession] = useState<BrisketSession | null>(null);
  const [pastSessions, setPastSessions] = useState<BrisketSession[]>([]);
  const [showStartModal, setShowStartModal] = useState(false);
  const [editingSession, setEditingSession] = useState<BrisketSession | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // Load active session
      const activeResponse = await fetch('/api/brisket?active=true');
      if (activeResponse.ok) {
        const active = await activeResponse.json();
        setActiveSession(active);
      }

      // Load all sessions
      const allResponse = await fetch('/api/brisket');
      if (allResponse.ok) {
        const all = await allResponse.json();
        setPastSessions(all.filter((s: BrisketSession) => s.status === 'completed'));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header
          title="Brisket Tracker"
          subtitle="Loading..."
          showAddButton={false}
        />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        title="Brisket Tracker"
        subtitle={activeSession ? 'Active Smoke' : `${pastSessions.length} session${pastSessions.length !== 1 ? 's' : ''} completed`}
        showAddButton={false}
        icon={<LocalFireDepartment />}
        backButton={true}
        onBack={() => router.push('/')}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          {!activeSession && (
            <MuiButton
              variant="contained"
              color="error"
              startIcon={<Add />}
              onClick={() => setShowStartModal(true)}
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Start New Session
            </MuiButton>
          )}
        </Box>

      {activeSession && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalFireDepartment color="error" />
            Active Smoke
          </Typography>
          <BrisketTracker session={activeSession} onUpdate={loadSessions} />
        </Box>
      )}

      {!activeSession && pastSessions.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <LocalFireDepartment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No brisket sessions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start your first brisket smoking session and track your progress!
            </Typography>
            <MuiButton
              variant="contained"
              color="error"
              startIcon={<Add />}
              onClick={() => setShowStartModal(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Start Your First Brisket
            </MuiButton>
          </CardContent>
        </Card>
      )}

      {pastSessions.length > 0 && (
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
                <Typography variant="h4">{pastSessions.length}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                <Typography variant="h4">
                  {pastSessions.filter(s => s.rating).length > 0
                    ? (pastSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / pastSessions.filter(s => s.rating).length).toFixed(1)
                    : 'N/A'}
                  {pastSessions.filter(s => s.rating).length > 0 && ' ⭐'}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Best Result</Typography>
                <Typography variant="h4">
                  {Math.max(...pastSessions.map(s => s.rating || 0))} ⭐
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History />
              Past Sessions
            </Typography>
            {pastSessions.length > 1 && (
              <Button
                variant="text"
                size="small"
                onClick={() => setShowAllHistory(!showAllHistory)}
                sx={{ textTransform: 'none' }}
              >
                {showAllHistory ? 'Show Less' : `Show All (${pastSessions.length})`}
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {(showAllHistory ? pastSessions : pastSessions.slice(0, 1)).map((session) => (
              <Card key={session.id} sx={{ '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">
                        {session.weight}kg Brisket
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(session.startedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        {session.rating && (
                          <Typography variant="h6">
                            {getRatingStars(session.rating)}
                          </Typography>
                        )}
                        {session.adjustments && (
                          <Chip label="Adjusted" size="small" color="success" sx={{ mt: 1 }} />
                        )}
                      </Box>
                      <IconButton
                        onClick={() => setEditingSession(session)}
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {session.review && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {session.review}
                    </Typography>
                  )}

                  {session.imageUrl && (
                    <Box
                      component="img"
                      src={session.imageUrl}
                      alt="Brisket"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2,
                      }}
                    />
                  )}

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, fontSize: '0.875rem' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Smoke</Typography>
                      <Typography variant="body2">{session.targetSmokeTemp}°C</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Wrap</Typography>
                      <Typography variant="body2">{session.actualWrapTemp || session.targetWrapTemp}°C</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Finish</Typography>
                      <Typography variant="body2">{session.actualFinishTemp || session.targetFinishTemp}°C</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Duration</Typography>
                      <Typography variant="body2">
                        {Math.floor((session.actualDuration || session.targetDuration) / 60)}h {(session.actualDuration || session.targetDuration) % 60}m
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <StartBrisketModal
        open={showStartModal}
        onClose={() => setShowStartModal(false)}
        onSuccess={() => {
          setShowStartModal(false);
          loadSessions();
        }}
      />

      {editingSession && (
        <BrisketEditModal
          open={!!editingSession}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSuccess={() => {
            setEditingSession(null);
            loadSessions();
          }}
        />
      )}
      </Container>
    </Box>
  );
}
