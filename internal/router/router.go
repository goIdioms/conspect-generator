package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/goIdioms/conspect-generator/internal/handlers"
)

type Router struct {
	Router       chi.Router
	AudioHandler *handlers.AudioHandler
}

func NewRouter() *Router {
	return &Router{
		Router:       chi.NewRouter(),
		AudioHandler: handlers.NewAudioHandler(),
	}
}

func (r *Router) SetupRoutes() {
	r.Router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Healthy"))
	})
	r.Router.Post("/audio", r.AudioHandler.Handle)
}

func (r *Router) SetupMiddlewares() {
	r.Router.Use(middleware.Logger)
}
