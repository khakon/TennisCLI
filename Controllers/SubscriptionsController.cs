using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TennisCLI.Models;

namespace TennisCLI.Controllers
{
  [Route("api/subs")]
  public class SubscriptionsController : Controller
  {
    private long start = 1504224000000;
    private int year = 2017;
    private int month = 10;
    private TennisDbContext db;
    public SubscriptionsController(TennisDbContext tennisContext)
    {
      db = tennisContext;
    }
    public IActionResult Index()
    {
      return View();
    }
    [HttpGet("GetByMonth/{month}")]
    public IActionResult GetByMonth(int month = 0)
    {
      if (month == 0) month = DateTime.Now.Month;
      var reservs = db.Reservations.Where(s => s.Month == month && s.Year == year);
      var players = db.SubscribePlayers.Where(s => reservs.Any(r => r.Id == s.ReservationId));
      var result = players.Select(s => new
      {
        s.Id,
        s.Reservation.Start,
        s.Reservation.Range,
        Price = s.Reservation.Price.Name,
        Court = s.Reservation.Court.Name,
        s.Reservation.PriceId,
        s.Reservation.CourtId,
        s.Reservation.Total,
        TrenerId = db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId) == null ? 0 : db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId).TrenerId,
        Trener = db.Treners.FirstOrDefault(r => r.Id == db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId).TrenerId).Name,
        s.PlayerId,
        s.Player.Name,
        s.Order,
        State = "wait"
      }).OrderBy(s => s.Start).ThenBy(s => s.CourtId);
      return Ok(new
      {
        model = result,
        apiStatus = "successfully_retrieved_customers",
        message = "Successfully able to retrieve customers",
        success = true
      });
    }
    [HttpGet("GetById/{id}")]
    public IActionResult GetById(int id = 0)
    {
      var players = db.SubscribePlayers.Where(s => s.Id == id);
      var result = players.Select(s => new
      {
        s.Id,
        s.Reservation.Start,
        s.Reservation.Range,
        Price = s.Reservation.Price.Name,
        Court = s.Reservation.Court.Name,
        s.Reservation.PriceId,
        s.Reservation.CourtId,
        s.Reservation.Total,
        TrenerId = db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId) == null ? 0 : db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId).TrenerId,
        Trener = db.Treners.FirstOrDefault(r => r.Id == db.SubscribeTreners.FirstOrDefault(t => t.ReservationId == s.ReservationId).TrenerId).Name,
        s.PlayerId,
        s.Player.Name
      }).FirstOrDefault();
      return Ok(new
      {
        model = result,
        apiStatus = "successfully_retrieved_customers",
        message = "Successfully able to retrieve customers",
        success = true
      });
    }
  }
}