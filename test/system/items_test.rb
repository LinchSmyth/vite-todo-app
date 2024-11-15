require "application_system_test_case"

class ItemsTest < ApplicationSystemTestCase
  test "visiting the index" do
    visit root_url

    assert_selector "h1", text: "TODO APPLICATION"
  end

  test "adding an item" do
    visit root_url

    fill_in(placeholder: "Task Name", with: "First task")
    click_on("Add")

    within(".card") do
      assert_selector "li", text: "First task"
    end

    assert_field(placeholder: "Task Name", with: "")
  end
end
